const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// [FRONTEND UI - THE ULTIMATE INTERFACE]
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>cvAI4 - Multi Media Downloader</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap');
            body { background-color: #050505; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif; }
            .main-card { background: #111111; border: 1px solid #222222; box-shadow: 0 0 40px rgba(59, 130, 246, 0.1); }
            .input-box { background: #1a1a1a; border: 1px solid #333333; transition: 0.3s; }
            .input-box:focus { border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
            .btn-gradient { background: linear-gradient(135deg, #3b82f6, #8b5cf6); transition: 0.3s; }
            .btn-gradient:hover { opacity: 0.9; transform: translateY(-2px); }
        </style>
    </head>
    <body class="flex items-center justify-center min-h-screen p-6">
        <div class="main-card p-8 rounded-[2rem] w-full max-w-lg">
            <div class="text-center mb-10">
                <h1 class="text-3xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    cvAI4 DOWNLOADER
                </h1>
                <p class="text-[10px] text-gray-500 tracking-[0.2em] font-bold">BY GIGS/XYREN - STEMPER NODE</p>
            </div>

            <div class="space-y-4">
                <input type="text" id="urlInput" placeholder="Tempel link TikTok / Instagram di sini..." 
                    class="input-box w-full p-4 rounded-2xl outline-none text-sm text-center">
                
                <button onclick="processRequest()" id="btnAction" class="btn-gradient w-full py-4 rounded-2xl font-bold shadow-xl">
                    <i class="fa-solid fa-cloud-arrow-down mr-2"></i> ANALISIS MEDIA
                </button>
            </div>

            <div id="resultBox" class="mt-8 hidden animate-fade-in">
                <div class="p-4 bg-[#1a1a1a] rounded-2xl border border-[#333333] mb-4">
                    <p id="videoTitle" class="text-xs text-center text-gray-400 font-bold mb-4 italic"></p>
                    
                    <div class="grid grid-cols-1 gap-3">
                        <a id="videoLink" href="#" target="_blank" class="w-full bg-[#222222] hover:bg-[#333333] p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#444444]">
                            <i class="fa-brands fa-tiktok text-blue-400"></i> VIDEO (NO WATERMARK)
                        </a>
                        <a id="hdLink" href="#" target="_blank" class="w-full bg-[#222222] hover:bg-[#333333] p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#444444]">
                            <i class="fa-solid fa-clapperboard text-purple-400"></i> VIDEO HD (720P)
                        </a>
                        <a id="musicLink" href="#" target="_blank" class="w-full bg-[#222222] hover:bg-[#333333] p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#444444]">
                            <i class="fa-solid fa-music text-orange-400"></i> AUDIO SAJA (MP3)
                        </a>
                    </div>
                </div>
            </div>

            <div id="loading" class="hidden mt-6 text-center">
                <div class="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p class="text-[10px] mt-2 text-blue-500 font-bold uppercase tracking-widest">Processing Data...</p>
            </div>
        </div>

        <script>
            async function processRequest() {
                const url = document.getElementById('urlInput').value;
                const btn = document.getElementById('btnAction');
                const result = document.getElementById('resultBox');
                const loader = document.getElementById('loading');

                if(!url) return alert("Tuan, masukkan linknya dulu!");

                btn.disabled = true;
                loader.classList.remove('hidden');
                result.classList.add('hidden');

                try {
                    const response = await fetch(\`/api/download?url=\${encodeURIComponent(url)}\`);
                    const data = await response.json();

                    if(data.status === 'success') {
                        document.getElementById('videoTitle').innerText = data.title;
                        document.getElementById('videoLink').href = data.video;
                        document.getElementById('hdLink').href = data.hd || data.video;
                        document.getElementById('musicLink').href = data.music;
                        result.classList.remove('hidden');
                    } else {
                        alert("Gagal memproses media. Cek link Tuan!");
                    }
                } catch (e) {
                    alert("Gagal terhubung ke pusat!");
                } finally {
                    btn.disabled = false;
                    loader.classList.add('hidden');
                }
            }
        </script>
    </body>
    </html>
    `);
});

// [BACKEND LOGIC - THE ENGINE]
app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    try {
        const response = await axios.get(`https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = response.data.data;
        
        if (!data) return res.status(404).json({ status: 'error' });

        res.json({
            status: 'success',
            title: data.title || "cvAI4 Media File",
            video: data.play,    // No Watermark
            hd: data.hdplay,     // HD 720p/Higher
            music: data.music    // MP3
        });
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('cvAI4 Engine v3 Active'));
