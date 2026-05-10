const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Tambahkan ini
const app = express();

app.use(cors()); // Aktifkan akses lintas domain

app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    if(!url) return res.status(400).json({ error: "URL mana Tuan?" });

    try {
        const options = {
            method: 'POST',
            url: 'https://tikwm.com/api/', 
            data: { url: url }
        };
        
        const response = await axios.request(options);
        // [LOGIC CHECK]: Mengirim balik data bersih ke Frontend
        res.json({
            status: 'success',
            download_url: "https://tikwm.com" + response.data.data.play, 
            title: response.data.data.title,
            cover: response.data.data.cover
        });
    } catch (error) {
        res.status(500).json({ error: "Node cvAI4 Gagal Kontak Server Pusat." });
    }
});

const PORT = process.env.PORT || 3000; // Railway menggunakan Dynamic Port
app.listen(PORT, () => console.log(`cvAI4 Engine Active on Port ${PORT}`));
