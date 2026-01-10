import https from 'https';

const apiKey = 'AIzaSyCFjKwuDtseAdRl5RSlFcsfMormMBdZBGA';
const data = JSON.stringify({
    contents: [{
        parts: [{ text: 'قل مرحبا' }]
    }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', responseData);

        if (res.statusCode === 200) {
            console.log('\n✅ المفتاح يعمل بنجاح!');
        } else {
            console.log('\n❌ المفتاح لا يعمل!');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ خطأ:', error.message);
});

req.write(data);
req.end();
