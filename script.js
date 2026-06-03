        $(document).ready(function () {
            // 1. AJAX: TOP ANIME (ACTION)
            $.ajax({
                url: "https://api.jikan.moe/v4/top/anime?q=action&sfw",
                success: function (res) {
                    let items= ''

                    res.data.forEach(function (item) {
                        items += `
                            <div class="brutalist-card overflow-hidden group">
                                <button onclick="getDetail(${item.mal_id})" class="w-full text-left">
                                    <figure class="h-[400px] overflow-hidden border-b-4 border-black relative">
                                        <img src="${item.images.jpg.large_image_url || item.images.jpg.image_url}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                        <div class="absolute top-4 left-4">
                                            <span class="bg-black text-white px-3 py-1 font-black text-sm border-2 border-black rotate-[-2deg] inline-block">⭐ ${item.score || 'N/A'}</span>
                                        </div>
                                    </figure>
                                </button>
                                <div class="p-6">
                                    <h2 class="text-2xl font-black italic mb-2 line-clamp-1">${item.title}</h2>
                                    <div class="flex items-center justify-between">
                                        <p class="font-bold uppercase text-sm tracking-tighter opacity-70">${item.type} • ${item.episodes || '?'} EPS</p>
                                        <button onclick="getDetail(${item.mal_id})" class="brutalist-btn px-4 py-1 text-sm">INFO</button>
                                    </div>
                                </div>
                            </div>
                        `
                    });

                    $("#animeContainer").html(items);
                }
            })

           // 2. AJAX: HERO SLIDER (Refined Split Layout)
            $.ajax({
                url: "https://api.jikan.moe/v4/seasons/now?sfw&limit=6",
                success: function (res) {
                    let items = '';
                    let totalItems = res.data.length;

                    res.data.forEach(function (item, index) {
                        let currentSlideNum = index + 1;
                        let prevSlideNum = currentSlideNum === 1 ? totalItems : currentSlideNum - 1;
                        let nextSlideNum = currentSlideNum === totalItems ? 1 : currentSlideNum + 1;

                        let bannerImg = item.images.jpg.large_image_url || item.images.jpg.image_url;
                        let synopsis = item.synopsis ? item.synopsis.substring(0, 180) + '...' : 'Dive into the latest anime season and explore epic stories.';

                        items += `
                        <div id="slide-hero-${currentSlideNum}" class="carousel-item relative w-full h-full bg-white flex flex-col md:flex-row overflow-hidden">
                            <!-- Image Section -->
                            <div class="w-full md:w-2/3 h-64 md:h-full relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
                                <img src="${bannerImg}" class="w-full h-full object-cover object-top" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20"></div>
                            </div>

                            <!-- Content Section -->
                            <div class="w-full md:w-1/3 p-8 flex flex-col justify-center bg-white relative">
                                <div class="absolute top-0 right-0 bg-primary px-4 py-2 border-b-4 border-l-4 border-black font-black uppercase text-xs z-10">
                                    SEASONAL PICK #${currentSlideNum}
                                </div>
                                
                                <span class="bg-black text-white font-black px-4 py-1 text-xs mb-4 self-start uppercase tracking-widest rotate-1">
                                    TRENDING
                                </span>

                                <h1 class="text-4xl md:text-5xl font-black italic leading-none mb-4 uppercase break-words">
                                    ${item.title}
                                </h1>

                                <p class="text-sm font-bold mb-6 text-gray-700 leading-relaxed border-l-4 border-primary pl-4">
                                    ${synopsis}
                                </p>

                                <div class="flex flex-wrap gap-3">
                                    <button class="brutalist-btn px-6 py-3 text-lg bg-primary">
                                        WATCH
                                    </button>
                                    <button onclick="getDetail(${item.mal_id})" class="brutalist-btn px-6 py-3 text-lg bg-white">
                                        DETAILS
                                    </button>
                                </div>

                                <!-- Slider Nav -->
                                <div class="absolute bottom-8 right-8 flex gap-4">
                                    <a href="#slide-hero-${prevSlideNum}" class="brutalist-btn w-12 h-12 flex items-center justify-center text-2xl bg-white">❮</a>
                                    <a href="#slide-hero-${nextSlideNum}" class="brutalist-btn w-12 h-12 flex items-center justify-center text-2xl bg-primary">❯</a>
                                </div>
                            </div>
                        </div>
                    `;
                    });

                    $("#heroSlider").html(items);
                }
            });


           // 3. AJAX: RECOMMENDATIONS
           $.ajax({
                url: "https://api.jikan.moe/v4/recommendations/anime?limit=10",
                success: function (res) {
                    let items = ''; 

                    res.data.forEach(function (item) {
                        let animeData = item.entry[0];
                        let imgUrl = animeData.images && animeData.images.jpg ? animeData.images.jpg.image_url : 'https://placehold.co/300x400?text=No+Image';
                        let title = animeData.title || 'Unknown Title';

                        items += `
                <div class="brutalist-card bg-white text-black overflow-hidden group">
                    <figure class="h-[300px] overflow-hidden border-b-4 border-black">
                        <img src="${imgUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${title}" />
                    </figure>
                    <div class="p-4 bg-white">
                        <h2 class="text-xl font-black italic mb-2 line-clamp-1" title="${title}">
                            ${title}
                        </h2>
                        <p class="text-xs font-bold uppercase italic opacity-60 line-clamp-2">
                            "${item.content || 'Must watch!'}"
                        </p>
                    </div>
                </div>
            `;
                    });

                    $("#recomendationContainer").html(items);
                }
            });
        });

        // LIVE FILTER SEARCH
        $("#searchAnime").on("keyup", function () {
            let value = $(this).val().toLowerCase();
            $("#animeContainer .brutalist-card").filter(function () {
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
            let item = res.data;
            let imgUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || 'https://placehold.co';
            let title = item.title_english || item.title || 'Unknown Title';
            let synopsis = item.synopsis || 'No Synopsis Available';
            
            let score = item.score || 'N/A';
            let status = item.status || 'Unknown';
            let type = item.type || 'TV';
            let rating = item.rating || 'Not Rated';

            let items = `
                <div class="brutalist-card max-w-6xl w-full flex flex-col md:flex-row overflow-hidden relative max-h-[90vh] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                    <!-- Close Button -->
                    <button onclick="closeModal()" class="brutalist-btn w-12 h-12 absolute top-6 right-6 z-50 flex items-center justify-center text-2xl bg-white hover:bg-red-500 transition-colors">✕</button>

                    <!-- Image Column -->
                    <figure class="md:w-[35%] h-80 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black relative shrink-0">
                        <img src="${imgUrl}" class="w-full h-full object-cover" alt="${title}" />
                        <div class="absolute bottom-8 left-8">
                            <span class="bg-primary text-black border-4 border-black px-6 py-2 font-black text-2xl rotate-[-3deg] inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">⭐ ${score}</span>
                        </div>
                    </figure>

                    <!-- Content Column (Scrollable) -->
                    <div class="md:w-[65%] p-8 md:p-14 bg-white overflow-y-auto">
                        <div class="mb-10">
                            <h2 class="text-4xl md:text-6xl font-black italic mb-6 leading-none uppercase break-words pr-12">
                                ${title}
                            </h2>
                            
                            <div class="flex flex-wrap gap-3 mb-10">
                                <span class="bg-black text-white border-2 border-black px-4 py-2 font-black text-sm uppercase italic rotate-1 inline-block">Status: ${status}</span>
                                <span class="bg-primary text-black border-2 border-black px-4 py-2 font-black text-sm uppercase italic -rotate-1 inline-block">Type: ${type}</span>
                                <span class="bg-white text-black border-2 border-black px-4 py-2 font-black text-sm uppercase italic rotate-2 inline-block">Rating: ${rating}</span>
                            </div>
                        </div>

                        <div class="mb-12">
                            <h3 class="text-2xl font-black uppercase mb-6 underline decoration-8 underline-offset-8 decoration-primary italic">SYNOPSIS //</h3>
                            <div class="relative">
                                <div class="bg-black h-full w-2 absolute -left-6 hidden md:block"></div>
                                <p class="text-lg md:text-xl font-bold italic leading-relaxed text-gray-800 bg-gray-50 p-6 border-l-4 md:border-l-0 border-black">
                                    "${synopsis}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $("#detailContainer").html(items);
            modal.classList.add("active");
            document.body.classList.add("modal-open");
        }
    });
}

const closeModal = () => {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
};

const getYear = (date) => {
    let year = new Date(date).getFullYear();
    return year;
}

document.getElementById("year").innerHTML = getYear(new Date());