        $(document).ready(function () {
            $.ajax({
                url: "https://api.jikan.moe/v4/top/anime?q=action&sfw",
                success: function (res) {
                    console.log(res);

                    let items= ''

                    res.data.forEach(function (item) {
                        items += `
                            <div class="card anime-card bg-slate-900 shadow-2xl floating">
                            <button onclick="getDetail(${item.mal_id})">
                            <figure class="h-[300px] overflow-hidden">
                                <img src="${item.images.jpg.image_url}" class="w-full h-full object-cover" />
                            </figure>
                            </button>
                                <div class="card-body">
                                    <h2 class="card-title">${item.title}</h2>
                                    <p class="text-gray-400">${item.type} • ${item.episodes} Episodes</p>
                                    <div class="rating rating-sm">
                                        ${item.score}
                                    </div>
                                </div>
                            </div>
                        `
                    });

                    $("#animeContainer").html(items);

                }
            })

           // 2. AJAX KEDUA: HERO SLIDER (PERBAIKAN LOGIC INDEX SLIDE)
            $.ajax({
                url: "https://api.jikan.moe/v4/seasons/now?sfw&limit=10",
                success: function (res) {
                    let items = '';
                    let totalItems = res.data.length;

                    res.data.forEach(function (item, index) {
                        // Tentukan slide sebelum (prev) dan sesudah (next) berdasarkan index array (0 sampai total-1)
                        let currentSlideNum = index + 1;
                        let prevSlideNum = currentSlideNum === 1 ? totalItems : currentSlideNum - 1;
                        let nextSlideNum = currentSlideNum === totalItems ? 1 : currentSlideNum + 1;

                        // Menggunakan large_image_url agar tidak blur di banner lebar
                        let bannerImg = item.images.jpg.large_image_url || item.images.jpg.image_url;
                        // Ambil sinopsis pendek jika ada
                        let synopsis = item.synopsis ? item.synopsis.substring(0, 150) + '...' : 'Explore epic stories and join the anime community.';

                        items += `
                        <div id="slide-hero-${currentSlideNum}" class="carousel-item relative w-full h-full">

                            <img src="${bannerImg}" class="w-full h-full object-cover object-top" />

                            <div class="absolute inset-0 hero-overlay-custom"></div>

                            <div class="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 max-w-xl p-4 md:p-0 z-10">
                                <span class="badge badge-primary mb-4">
                                    NOW SHOWING THIS SEASON
                                </span>

                                <h1 class="text-3xl md:text-5xl font-black leading-tight mb-4 tracking-tight drop-shadow-md">
                                    ${item.title}
                                </h1>

                                <p class="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
                                    ${synopsis}
                                </p>

                                <div class="flex gap-4">
                                    <button class="btn btn-primary rounded-full px-6 md:px-8 shadow-lg">
                                        Watch Now
                                    </button>
                                    <button class="btn btn-outline text-white rounded-full px-6 md:px-8">
                                        Explore
                                    </button>
                                </div>
                            </div>

                            <!-- Navigasi Slider Menggunakan ID Index Berurutan -->
                            <div class="absolute left-5 right-5 top-1/2 -translate-y-1/2 flex justify-between z-20">
                                <a href="#slide-hero-${prevSlideNum}" class="btn btn-circle btn-sm md:btn-md bg-black/40 border-none text-white hover:bg-primary">❮</a>
                                <a href="#slide-hero-${nextSlideNum}" class="btn btn-circle btn-sm md:btn-md bg-black/40 border-none text-white hover:bg-primary">❯</a>
                            </div>

                        </div>
                    `;
                    });

                    $("#heroSlider").html(items);
                },
                error: function (err) {
                    console.error("Gagal memuat data season hero slider:", err);
                }
            });


           $.ajax({
                // Perbaikan tanda ? dan = pada query parameter
                url: "https://api.jikan.moe/v4/recommendations/anime?limit=10",
                success: function (res) {
                    console.log(res);
                    let items = ''; 

                    res.data.forEach(function (item) {
                        // Karena item.entry berbentuk array (berisi rekomendasi pasangannya), 
                        // kita ambil entri pertama [0] agar tidak undefined.
                        let animeData = item.entry[0];

                        // Definisikan gambar & judul dengan aman
                        let imgUrl = animeData.images && animeData.images.jpg ? animeData.images.jpg.image_url : 'https://placehold.co/300x400?text=No+Image';
                        let title = animeData.title || 'Unknown Title';

                        items += `
                <div class="card anime-card bg-slate-900 shadow-2xl">
                    <figure class="h-[300px] overflow-hidden">
                        <img src="${imgUrl}" class="w-full h-full object-cover" alt="${title}" />
                    </figure>
                    <div class="card-body p-4">
                        <h2 class="card-title text-sm md:text-base font-bold line-clamp-2" title="${title}">
                            ${title}
                        </h2>
                        <p class="text-xs text-gray-500 mt-1 italic line-clamp-2">
                            "${item.content || 'Recommended for you'}"
                        </p>
                    </div>
                </div>
            `;
                    });

                    $("#recomendationContainer").html(items);
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error: ", error);
                }
            });
        });

            // 3. LOGIC LIVE FILTER SEARCH
        $("#searchAnime").on("keyup", function () {
            let value = $(this).val().toLowerCase();
            $("#animeContainer .card").filter(function () {
                $(this).toggle(
                    $(this).text().toLowerCase().indexOf(value) > -1
                );
            });
        });

 const modal = document.querySelector(".detailModal");

const getDetail = (id) => {
    const url = `https://api.jikan.moe/v4/anime/${id}`;
    $.ajax({
        url: url,
        success: function (res) {
            console.log(res);

            let item = res.data;
            // Ambil data sesuai struktur objek API asli yang kamu kirim
            let imgUrl = item.images?.jpg?.image_url || 'https://placehold.co';
            let title = item.title_english || item.title || 'Unknown Title';
            let synopsis = item.synopsis || 'No Synopsis Available';
            
            // Data tambahan dari API kamu:
            let score = item.score || 'N/A';
            let status = item.status || 'Unknown';
            let type = item.type || 'TV';
            let rating = item.rating || 'Not Rated';

            let items = `
                <div class="card bg-slate-900 text-white shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-800">
                    <!-- Tombol Close (Dipindah ke sudut card agar aman dari overflow gambar) -->
                    <button onclick="closeModal()" class="btn btn-circle btn-sm bg-black/60 border-none text-white hover:bg-red-600 absolute top-3 right-3 z-50">✕</button>

                    <figure class="h-[250px] overflow-hidden relative">
                        <img src="${imgUrl}" class="w-full h-full object-cover" alt="${title}" />
                        <!-- Badge Score & Type Melayang di atas Gambar -->
                        <div class="absolute bottom-2 left-2 flex gap-2">
                            <span class="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">⭐ ${score}</span>
                            <span class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">${type}</span>
                        </div>
                    </figure>

                    <div class="card-body p-5">
                        <h2 class="card-title text-base md:text-lg font-bold text-slate-100 fallback-line-clamp" title="${title}">
                            ${title}
                        </h2>
                        
                        <!-- Info Detail Tambahan -->
                        <div class="flex flex-wrap gap-2 my-2 text-[10px] text-gray-400">
                            <span class="border border-gray-700 px-2 py-0.5 rounded">Status: ${status}</span>
                            <span class="border border-gray-700 px-2 py-0.5 rounded">Rating: ${rating}</span>
                        </div>

                        <!-- Sinopsis dengan scroll jika terlalu panjang -->
                        <p class="text-xs text-gray-400 mt-2 italic max-h-[120px] overflow-y-auto pr-1 leading-relaxed">
                            "${synopsis}"
                        </p>
                    </div>
                </div>
            `;
            $("#detailContainer").html(items);
            
            // Aktifkan modal
            modal.classList.add("active"); 
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error: ", error);
        }
    });
}

const closeModal = () => {
    modal.classList.remove("active");
};