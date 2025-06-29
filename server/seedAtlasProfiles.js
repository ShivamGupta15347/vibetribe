const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Companion = require('./models/Companion');
require('dotenv').config({ path: './config.env' });

// Connect to MongoDB Atlas (production database)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Indian girl names (realistic and modern)
const indianNames = [
    'Priya Sharma', 'Aisha Patel', 'Zara Khan', 'Ananya Reddy', 'Kavya Singh',
    'Ishita Gupta', 'Mira Joshi', 'Riya Malhotra', 'Sana Ahmed', 'Diya Verma',
    'Kiara Kapoor', 'Aaradhya Mehta', 'Vanya Chopra', 'Myra Bhat', 'Zoya Ali',
    'Avni Desai', 'Kyra Nair', 'Aisha Rao', 'Maya Iyer', 'Sia Menon',
    'Ira Saxena', 'Riya Choudhury', 'Zara Qureshi', 'Anaya Sinha', 'Misha Das',
    'Kiara Banerjee', 'Aisha Mukherjee', 'Zara Chatterjee', 'Myra Dutta', 'Vanya Bose'
];

// Gen Z style profile photos (beach, club, lifestyle)
const profilePhotos = [
    // Beach photos
    'https://imgs.search.brave.com/HiejQ9XPdDFRiEZKZWE6bR5MX_XFsyzzeyw2tSb4-yc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3Nib29rLmluL3dw/LWNvbnRlbnQvdXBs/b2Fkcy9pbnN0YWdy/YW0tZHAtZm9yLWdp/cmxzLWJsYWNrXzY5/LndlYnA',
    'https://imgs.search.brave.com/O4ViZCiCtrjblbtkkq-FsPHM3-9JcCFtyx9rQCuAkqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvSW5zdGFn/cmFtLUdpcmxzLURw/LmpwZw',
    'https://imgs.search.brave.com/kK0l2QlRWicKxigTmLM4pfM5u4iAvqtN53Cench1_OA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1m/b3ItaW5zdGFncmFt/LWFlc3RoZXRpY18x/NjEud2VicA',
    'https://imgs.search.brave.com/gfBHoe7TmodLl-WIaKa2Dn3BtZ9gtCIClGz9Yi992Pg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9hdHRpdHVkZS1n/aXJscy1kcC1mb3It/aW5zdGFncmFtXzE1/MC53ZWJw',
    'https://imgs.search.brave.com/bXqGCgw-VryHUyy2SrRpCvoQvzYBvVGtDNvJ_4CU424/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NraW5nLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9pbnN0YWdyYW0t/ZHAtZm9yLWdpcmxz/XzgxLndlYnA',
    
    // Club/Party photos
    'https://imgs.search.brave.com/SQQVIm-7lM_Xg1a04aQZbgq2NZF15YrA-Yj5d9tr0yE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1k/b3dubG9hZC1mb3It/aW5zdGFncmFtXzc3/LndlYnA',
    'https://imgs.search.brave.com/f-m_R3F99WkOjiAUjTFgHB4f4u-_wEIMaY_zxlaGtu8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9pbnN0YWdyYW0t/Z2lybHMtZHBfMTA5/LndlYnA',
    'https://imgs.search.brave.com/D-Q21xMCcmOhz-j7dE4ivQzgS6ZJwHduIQwDZnlX1dE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NydXNoLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvY3V0ZS1n/aXJsLXBpYy1mb3It/ZHAtaW5zdGFncmFt/LXNpbXBsZS1hdHRp/dHVkZS5qcGc',
    'https://imgs.search.brave.com/f4kpzVJUSVtyHhHFsT98sbjMH3246-G4iIvx61c1nO8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NraW5nLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9pbnN0YS1naXJs/cy1kcF82NC53ZWJw',
    'https://imgs.search.brave.com/nBB3AY0pakXC1s-TZQh0KQtK-yyOY1INN_-1o884Sow/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9hdHRpdHVkZS1n/aXJsLWRwLWJsYWNr/LWZvci1pbnN0YWdy/YW1fNTUud2VicA',
    
    // Lifestyle/Cafe photos
    'https://imgs.search.brave.com/5IZm2Yb9wA2QvrkKYNo7Ev2hhAFmLc26spPbSBk1UTo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvSG90LUdp/cmxzLURwLTEuanBn',
    'https://imgs.search.brave.com/THPoNfeqabO-bvPiscf-e9HHBM-_hkWsBUvTk5Tpmj8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9jdXRlLWdpcmxz/LWRwLWZvci1pbnN0/YWdyYW0tY2FydG9v/bl8xMzIud2VicA',
    'https://imgs.search.brave.com/DT6jsnjOvy7nvVFmStp1LvPDD1HWpV-XwAMrut0SuPU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvQmxhY2st/SGFpci1HaXJscy1E/cC0xLmpwZw',
    'https://imgs.search.brave.com/ZNtAjXC6md6kvUAOZc1Mi8-QFXaiSq138cUhtll2RzY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9pbnN0YS1naXJs/cy1kcF81NS53ZWJw',
    'https://imgs.search.brave.com/9_F8iXpHk0_dmD5h_UHZxg28ggSY5MJk4lE5tuWlhMA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1k/cmVzc18xNjIud2Vi/cA',
    
    // Outdoor/Adventure photos
    'https://imgs.search.brave.com/8yD0R42xvh2i7VLimgUSFd_V1mbD9c27lJSboW3cXog/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9zaW5nbGUtaW5z/dGFncmFtLWRwLWJv/eV83OS53ZWJw',
    'https://imgs.search.brave.com/llqPlcWHqJ22PAO3eNWSQsDZlKTC6nK46GegYdMmGGg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9hdHRpdHVkZS1p/bnN0YWdyYW0tZHAt/Zm9yLWdpcmxzXzg1/LndlYnA',
    'https://imgs.search.brave.com/WYhzKRe7Tkihi8XKXRZXpFOL6nx6DaDEZPMHdlKwhAE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvZ2lybHMt/ZHA1OC5qcGc',
    'https://imgs.search.brave.com/xr9c3BRRCLrQL5h5RVgLXEbeGx2Aatfr11JCWWA1SlA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvU2h5LUdp/cmxzLURwLmpwZw',
    'https://imgs.search.brave.com/TYWPl4jVLIu6gwKmwqOoByw2_OMXm8ahNLDJifMUpfw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1m/b3ItaW5zdGFncmFt/LWhpZGRlbi1mYWNl/LWFlc3RoZXRpY18x/MjIud2VicA'
];

// Additional lifestyle photos for companion profiles
const additionalPhotos = [
    'https://imgs.search.brave.com/5IZm2Yb9wA2QvrkKYNo7Ev2hhAFmLc26spPbSBk1UTo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvSG90LUdp/cmxzLURwLTEuanBn',
    'https://imgs.search.brave.com/THPoNfeqabO-bvPiscf-e9HHBM-_hkWsBUvTk5Tpmj8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9jdXRlLWdpcmxz/LWRwLWZvci1pbnN0/YWdyYW0tY2FydG9v/bl8xMzIud2VicA',
    'https://imgs.search.brave.com/DT6jsnjOvy7nvVFmStp1LvPDD1HWpV-XwAMrut0SuPU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvQmxhY2st/SGFpcmx5LURwLTEuanBn',
    'https://imgs.search.brave.com/ZNtAjXC6md6kvUAOZc1Mi8-QFXaiSq138cUhtll2RzY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9pbnN0YS1naXJs/cy1kcF81NS53ZWJw',
    'https://imgs.search.brave.com/9_F8iXpHk0_dmD5h_UHZxg28ggSY5MJk4lE5tuWlhMA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1k/cmVzc18xNjIud2Vi/cA',
    
    // Outdoor/Adventure photos
    'https://imgs.search.brave.com/8yD0R42xvh2i7VLimgUSFd_V1mbD9c27lJSboW3cXog/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9zaW5nbGUtaW5z/dGFncmFtLWRwLWJv/eV83OS53ZWJw',
    'https://imgs.search.brave.com/llqPlcWHqJ22PAO3eNWSQsDZlKTC6nK46GegYdMmGGg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/NC9hdHRpdHVkZS1p/bnN0YWdyYW0tZHAt/Zm9yLWdpcmxzXzg1/LndlYnA',
    'https://imgs.search.brave.com/WYhzKRe7Tkihi8XKXRZXpFOL6nx6DaDEZPMHdlKwhAE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3N6b25lLm5ldC93/cC1jb250ZW50L3Vw/bG9hZHMvZ2lybHMt/ZHA1OC5qcGc',
    'https://imgs.search.brave.com/xr9c3BRRCLrQL5h5RVgLXEbeGx2Aatfr11JCWWA1SlA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NodWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvU2h5LUdp/cmxzLURwLmpwZw',
    'https://imgs.search.brave.com/TYWPl4jVLIu6gwKmwqOoByw2_OMXm8ahNLDJifMUpfw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9waG90/b3NidWxrLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8w/OC9naXJscy1kcC1m/b3ItaW5zdGFncmFt/LWhpZGRlbi1mYWNl/LWFlc3RoZXRpY18x/MjIud2VicA'
];

// Indian cities
const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi'
];

// Taglines for Gen Z vibe
const taglines = [
    "Living my best life ✨", "Adventure seeker & coffee lover ☕", "Good vibes only 🌟",
    "Making memories, not excuses 📸", "Life is better when you're laughing 😊",
    "Exploring the world one city at a time 🌍", "Dance like nobody's watching 💃",
    "Sunshine & good times ☀️", "Creating my own happiness 🎨", "Wild & free 🌿",
    "Living for the weekend 🎉", "Positive vibes only ✌️", "Life is a beautiful journey 🌈",
    "Making every moment count ⏰", "Adventure is out there 🗺️", "Good company, great conversations 💭",
    "Living life on my own terms 🚀", "Spreading joy wherever I go 🌸", "Dream big, work hard 💪",
    "Life is too short to be anything but happy 😄", "Exploring, learning, growing 🌱",
    "Making the world a better place, one smile at a time 😊", "Living authentically 🎯",
    "Chasing dreams & catching flights ✈️", "Life is what happens while you're busy making plans 📋"
];

// Descriptions
const descriptions = [
    "Hey there! I'm a fun-loving person who loves to explore new places, try different cuisines, and meet interesting people. Whether it's a coffee date, shopping spree, or just hanging out, I'm always up for a good time! Let's create some amazing memories together.",
    
    "Passionate about life and always ready for new adventures! I love traveling, photography, and meeting new people. Whether you need a travel buddy, someone to explore the city with, or just good company, I'm your person!",
    
    "Creative soul with a love for art, music, and meaningful conversations. I believe in living life to the fullest and making every moment count. Let's share stories, laugh together, and create beautiful memories!",
    
    "Fitness enthusiast and wellness advocate who believes in balance. I love trying new restaurants, going for walks, and having deep conversations. Looking for someone to share good vibes and positive energy with!",
    
    "Adventure seeker with a passion for exploring hidden gems in the city. I love street photography, trying new cafes, and meeting people from different walks of life. Let's discover the city together!",
    
    "Music lover and festival enthusiast who believes life is better with good tunes and great company. I'm always up for concerts, karaoke nights, or just chilling with good music. Let's vibe together!",
    
    "Foodie at heart who loves exploring different cuisines and restaurants. I believe food brings people together and creates the best memories. Whether it's street food or fine dining, I'm always excited to try something new!",
    
    "Bookworm and intellectual who loves deep conversations about life, philosophy, and everything in between. I also enjoy outdoor activities and believe in maintaining a healthy work-life balance.",
    
    "Social butterfly who loves meeting new people and creating connections. I'm passionate about fashion, beauty, and helping others feel confident. Let's have fun and make each other's day better!",
    
    "Tech enthusiast and gamer who also loves outdoor activities. I believe in the perfect balance of digital and real-world experiences. Whether it's gaming sessions or outdoor adventures, I'm always game!"
];

// Vibe tags combinations (using only valid enum values)
const vibeTagCombinations = [
    ['Social Butterfly', 'Foodie', 'Cafe Hopper'],
    ['Adventure Seeker', 'Travel Buddy', 'Photography'],
    ['Music Lover', 'Party Starter', 'Social Butterfly'],
    ['Fitness Freak', 'Adventure Seeker', 'Deep Talks'],
    ['Art Lover', 'Movie Buff', 'Photography'],
    ['Tech Lover', 'Gamer', 'Intellectual'],
    ['Bookworm', 'Deep Talks', 'Intellectual'],
    ['Foodie', 'Cafe Hopper', 'Social Butterfly'],
    ['Photography', 'Travel Buddy', 'Adventure Seeker'],
    ['Party Starter', 'Music Lover', 'Social Butterfly'],
    ['Fitness Freak', 'Adventure Seeker', 'Deep Talks'],
    ['Art Lover', 'Movie Buff', 'Photography'],
    ['Tech Lover', 'Gamer', 'Intellectual'],
    ['Bookworm', 'Deep Talks', 'Chiller'],
    ['Foodie', 'Cafe Hopper', 'Travel Buddy']
];

// Specializations combinations (using only valid enum values)
const specializationCombinations = [
    ['Cafe Hopping', 'Food Tour', 'Shopping Partner'],
    ['Travel Buddy', 'Photography Session', 'Cultural Tours'],
    ['Concert Buddy', 'Party Starter', 'Social Gatherings'],
    ['Workout Buddy', 'Fitness Training', 'Outdoor Adventures'],
    ['Museum Guide', 'Cultural Tours', 'Photography Session'],
    ['Gaming Sessions', 'Tech Events', 'Home Hangouts'],
    ['Book Clubs', 'Language Exchange', 'Skill Sharing'],
    ['Food Tour', 'Cafe Hopping', 'Shopping Partner'],
    ['Photography Session', 'Travel Buddy', 'Cultural Tours'],
    ['Party Starter', 'Concert Buddy', 'Social Gatherings'],
    ['Fitness Training', 'Workout Buddy', 'Outdoor Adventures'],
    ['Cultural Tours', 'Museum Guide', 'Photography Session'],
    ['Tech Events', 'Gaming Sessions', 'Home Hangouts'],
    ['Language Exchange', 'Book Clubs', 'Skill Sharing'],
    ['Shopping Partner', 'Food Tour', 'Cafe Hopping']
];

// Languages combinations
const languageCombinations = [
    ['English', 'Hindi'],
    ['English', 'Hindi', 'Marathi'],
    ['English', 'Hindi', 'Gujarati'],
    ['English', 'Hindi', 'Bengali'],
    ['English', 'Hindi', 'Tamil'],
    ['English', 'Hindi', 'Telugu'],
    ['English', 'Hindi', 'Kannada'],
    ['English', 'Hindi', 'Malayalam'],
    ['English', 'Hindi', 'Punjabi'],
    ['English', 'Hindi', 'Marathi', 'Gujarati']
];

// Availability templates
const availabilityTemplates = [
    {
        monday: { start: '10:00', end: '22:00', available: true },
        tuesday: { start: '10:00', end: '22:00', available: true },
        wednesday: { start: '10:00', end: '22:00', available: true },
        thursday: { start: '10:00', end: '22:00', available: true },
        friday: { start: '10:00', end: '23:00', available: true },
        saturday: { start: '11:00', end: '23:00', available: true },
        sunday: { start: '11:00', end: '21:00', available: true }
    },
    {
        monday: { start: '09:00', end: '21:00', available: true },
        tuesday: { start: '09:00', end: '21:00', available: true },
        wednesday: { start: '09:00', end: '21:00', available: true },
        thursday: { start: '09:00', end: '21:00', available: true },
        friday: { start: '09:00', end: '22:00', available: true },
        saturday: { start: '10:00', end: '22:00', available: true },
        sunday: { start: '10:00', end: '20:00', available: true }
    },
    {
        monday: { start: '11:00', end: '23:00', available: true },
        tuesday: { start: '11:00', end: '23:00', available: true },
        wednesday: { start: '11:00', end: '23:00', available: true },
        thursday: { start: '11:00', end: '23:00', available: true },
        friday: { start: '11:00', end: '00:00', available: true },
        saturday: { start: '12:00', end: '00:00', available: true },
        sunday: { start: '12:00', end: '22:00', available: true }
    }
];

// Generate random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Get random items from array (multiple)
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generate fake phone number
function generatePhoneNumber() {
    const prefixes = ['6', '7', '8', '9'];
    const prefix = getRandomItem(prefixes);
    const remaining = Math.floor(Math.random() * 900000000) + 100000000; // 9 digits
    return `${prefix}${remaining}`; // Total: 1 + 9 = 10 digits
}

// Generate fake email
function generateEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = getRandomItem(domains);
    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const numbers = Math.floor(Math.random() * 999);
    return `${cleanName}${numbers}@${domain}`;
}

// Create fake profiles for Atlas
async function createAtlasProfiles() {
    try {
        console.log('🌱 Starting to create fake Indian girl profiles in MongoDB Atlas...');
        console.log('🔗 Connecting to:', process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB');
        
        const createdProfiles = [];
        
        for (let i = 0; i < indianNames.length; i++) {
            const name = indianNames[i];
            const age = getRandomNumber(20, 30);
            const email = generateEmail(name);
            const phone = generatePhoneNumber();
            
            // Create user first
            const hashedPassword = await bcrypt.hash('password123', 12);
            
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                phone: phone,
                avatar: profilePhotos[i % profilePhotos.length],
                bio: `Hey! I'm ${name.split(' ')[0]} 👋`,
                interests: getRandomItems(vibeTagCombinations[i % vibeTagCombinations.length], 3),
                isCompanion: true
            });
            
            const savedUser = await user.save();
            
            // Create companion profile
            const city = getRandomItem(cities);
            const vibeTags = vibeTagCombinations[i % vibeTagCombinations.length];
            const specializations = specializationCombinations[i % specializationCombinations.length];
            const languages = languageCombinations[i % languageCombinations.length];
            const availability = availabilityTemplates[i % availabilityTemplates.length];
            
            // Generate multiple images for companion profile
            const images = [
                profilePhotos[i % profilePhotos.length],
                ...getRandomItems(additionalPhotos, 3)
            ];
            
            const companion = new Companion({
                user: savedUser._id,
                displayName: name.split(' ')[0],
                tagline: getRandomItem(taglines),
                description: getRandomItem(descriptions),
                vibeTags: vibeTags,
                hourlyRate: getRandomNumber(300, 1500),
                images: images,
                availability: availability,
                location: {
                    city: city,
                    area: `${city} Central`,
                    coordinates: {
                        lat: 20.5937 + (Math.random() - 0.5) * 10,
                        lng: 78.9629 + (Math.random() - 0.5) * 10
                    }
                },
                rating: {
                    average: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                    count: getRandomNumber(5, 50)
                },
                totalBookings: getRandomNumber(10, 100),
                isActive: true,
                isVerified: Math.random() > 0.3, // 70% verified
                specializations: specializations,
                languages: languages,
                age: age,
                gender: 'Female'
            });
            
            const savedCompanion = await companion.save();
            createdProfiles.push({ user: savedUser, companion: savedCompanion });
            
            console.log(`✅ Created profile for ${name} (${age} years old) in ${city}`);
        }
        
        console.log(`\n🎉 Successfully created ${createdProfiles.length} fake Indian girl profiles in MongoDB Atlas!`);
        console.log('📊 Summary:');
        console.log(`- Total profiles: ${createdProfiles.length}`);
        console.log(`- Age range: 20-30 years`);
        console.log(`- Cities covered: ${[...new Set(createdProfiles.map(p => p.companion.location.city))].length}`);
        console.log(`- Average rating: ${(createdProfiles.reduce((sum, p) => sum + p.companion.rating.average, 0) / createdProfiles.length).toFixed(1)}`);
        console.log('🌐 Database: MongoDB Atlas (Production)');
        
        return createdProfiles;
        
    } catch (error) {
        console.error('❌ Error creating fake profiles in Atlas:', error);
        throw error;
    }
}

// Main execution
async function main() {
    try {
        await createAtlasProfiles();
        console.log('\n✨ Atlas database seeding completed successfully!');
        console.log('🚀 Your VibeTribe app should now have fake profiles to display!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Atlas seeding failed:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { createAtlasProfiles }; 