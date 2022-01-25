//variables globales
const apiKey = "qe83wqMJuUaCwqCFgKC9HdVYv9aDtJm8";
let api = `https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`;
let gifActual = {
    id: '',
    title: '',
    url: '',
    username: '',
    width: '',
    height: ''
};

let page = 0;
let sliderPage = 0;
let sliderDesktop = [];
let sliderActuales = [];
let paginaFavoritos = 0;
let paginaMisGifos = 0;
let camara;
let recorder;
let is_recording = false;
let form;
let src;
let blob;
let tiempoGif;
let tempGif;
let playPromise;


//Referencias a HTML

const searchInput = document.getElementById('search-input');
const inputIconSearch = document.getElementById('input-icon-search');
const iconSearch = document.getElementById('icon-search');
const trendingResultGallery = document.getElementById("trending-result-gallery");
const saveFavoritesGallery = document.getElementById('saved-favorites-gallery');
const misGifosGallery = document.getElementById('mis-gifos-gallery');
const verMasBtn = document.getElementById("ver-mas-btn");
const sliderContainerDesktop = document.getElementById("slider-container-desktop");
const iconCloseCard = document.getElementById("icon-close-card");
const favImg = document.getElementById("fav-img");
const favImgActive = document.getElementById("fav-img-active");
const downloadImg = document.getElementById("download-img");
const sliderRight = document.getElementById("slider-right");
const sliderLeft = document.getElementById("slider-left");
const savedFavorites = document.getElementById("saved-favorites");
const misGifosSeccion = document.getElementById('mis-gifos');
const resultSearch = document.getElementById("trending-result");
const trending = document.getElementById("trending");
const verMasBtnFav = document.getElementById('ver-mas-btn-fav');
const verMasBtnMisgif = document.getElementById('ver-mas-btn-misgif');
const creacionGif = document.getElementById('creacion-gif');
const trendingGifos = document.getElementById('trending-gifos');
const btnCreacion = document.getElementById('btn-creacion');
const paso1 = document.getElementById('paso-1');
const paso2 = document.getElementById('paso-2');
const paso3 = document.getElementById('paso-3');
const imgElement = document.getElementById("img-element");
const imgContainer = document.getElementById('img-container');
const videoContainer = document.getElementById('video-container');

//Funciones

function validarCambioIcono(elem) {
    if (elem.classList.contains('icon-search')) {


        if (elem.classList.contains('nocturno-icon')) {
            elem.src = './assets/img/icon-search-modo-noct.svg'
        } else {
            elem.src = './assets/img/icon-search.svg'
        }
    } else if (elem.classList.contains('icon-close-search')) {


        if (elem.classList.contains('nocturno-icon')) {
            elem.src = './assets/img/close-modo-noct.svg'
        } else {
            elem.src = './assets/img/close.svg'
        }
    }
}

//Cambia a modo nocturno o diurno
function cambiarModo() {
    const elementos = document.querySelectorAll('.diurno');
    const nocturno = document.getElementById('nocturno');
    const nocturnoDesktop = document.getElementById('nocturno-desktop');

    if (nocturno.innerText == 'Modo diurno') {
        nocturno.innerText = 'Modo nocturno';
        nocturnoDesktop.innerText = 'Modo nocturno';
    } else {
        nocturno.innerText = 'Modo diurno'
        nocturnoDesktop.innerText = 'Modo diurno';
    }

    elementos.forEach(elem => {

        if (elem.id == 'lanzador') {
            elem.checked = false;
        } else if (elem.classList.contains('icon-search') || elem.classList.contains('icon-close-search')) {
            elem.classList.toggle('nocturno-icon')

            validarCambioIcono(elem);

        }
        else {
            elem.classList.toggle('nocturno')
        }


    });

}

// Realiza el fetch a la URL que ingresa como parametro
function gestUserData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(reason => console.log(reason));
}

//Trending words
function updateTrending(msg) {
    const trendingItems = document.getElementById("trending-items");
    trendingItems.innerHTML = msg;
}

function mostrarBusquedaTrending(word) {
    const border = document.getElementById("border");
    const trendingName = document.getElementById("trending-result-name");
    let sinDatosCont = document.getElementById('galeria-sin-datos');

    resultSearch.style.display = "block";
    border.style.display = "block";

    if (trendingName.innerHTML != word) {
        page = 0;
        trendingResultGallery.innerHTML = '';
    }

    if (sinDatosCont != null) {
        sinDatosCont.style.display = 'none';
    }

    //busco los gifs para la galeria

    trendingName.innerHTML = word;

    api = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${word}&limit=12&offset=${page}`;

    gestUserData(api)
        .then(response => {

            response.data.forEach(element => {

                let imgGif = {
                    url: element.images.fixed_height_downsampled.url,
                    width: element.images.fixed_height_downsampled.width,
                    height: element.images.fixed_height_downsampled.height,
                    id: element.id,
                    username: element.username,
                    title: element.title
                }


                mostrarGaleria(imgGif, 'S');

            });
            page += 13;
            if (response.data.length == 0) {



                if (sinDatosCont == null) {
                    sinDatosCont = document.createElement("div");
                    sinDatosCont.setAttribute("class", "galeria-sin-datos");
                    sinDatosCont.setAttribute("id", `galeria-sin-datos`);
                    trendingResultGallery.appendChild(sinDatosCont);

                    const imgSinDatos = document.createElement("img");
                    imgSinDatos.setAttribute("src", "assets/img/icon-busqueda-sin-resultado.svg");
                    sinDatosCont.appendChild(imgSinDatos);

                    const txtSinDatos = document.createElement("span");
                    txtSinDatos.setAttribute("id", "texto-sin-datos");
                    txtSinDatos.innerHTML = 'Intenta con otra búsqueda.'
                    sinDatosCont.appendChild(txtSinDatos);
                } else {
                    sinDatosCont.style.display = 'flex'
                }

            }
            if (response.data.length < 12) {
                verMasBtn.style.display = 'none';
            }

        })
        .catch(reason => {
            trendingResultGallery.innerHTML = `Error getting gallery: ${reason}`;
            console.log(`Error getting gallery: ${reason}`);
        });
}

//Funcion que inicializa la aplicacion
function iniciarGifos() {
    gestUserData(api)
        .then(response => {
            trendingResult = '';
            for (i = 0; i < 5; i++) {
                if (i == 4) {
                    trendingResult += `<a href="#trendings" onclick="mostrarBusquedaTrending('${response.data[i]}')">${response.data[i]}</a>`;
                } else {
                    trendingResult += `<a href="#trendings" onclick="mostrarBusquedaTrending('${response.data[i]}')">${response.data[i]}, </a>`;
                }

            }

            updateTrending(trendingResult);
        })
        .catch(reason => {
            console.log(`Error getting data ${reason}`);
            updateTrending(`Error getting data ${reason}`)
        });

    inicialzarSlider();

}

/** Muestra un mensaje de error en un tag del html */
function drawError(error, tag) {
    const errorTag = document.getElementById(tag);
    errorTag.innerHTML = error;
}


//funcion para descargar imagen
async function descargarImagen() {
    const image = await fetch(gifActual.url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = gifActual.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

//activa el html de autocompletar
function activarAutocompletar() {

    searchInput.classList.toggle('search-input-list');
    searchInput.classList.toggle('search-input');
    inputIconSearch.classList.toggle('autocomplete-container');
    inputIconSearch.classList.toggle('input-icon-search');
    let padre;

    if (iconSearch.classList.contains('icon-close-search')) {

        searchInput.value = '';
        const ulElemento = document.getElementById('autocomplete-list');
        if (ulElemento) {
            padre = ulElemento.parentNode;
            padre.removeChild(ulElemento);
        }

        const iElemento = document.getElementById('ifa');
        if (iElemento) {
            padre = iElemento.parentNode;
            padre.removeChild(iElemento);
        }

    } else {

        const ulElemento = document.createElement('ul');
        ulElemento.id = 'autocomplete-list';
        ulElemento.classList.add('autocomplete-list');
        inputIconSearch.append(ulElemento);

        const iElemento = document.createElement('i');
        iElemento.id = 'ifa';
        iElemento.classList.add('fa');
        iElemento.classList.add('fa-search');
        inputIconSearch.append(iElemento);
    }

    iconSearch.classList.toggle('icon-close-search');
    iconSearch.classList.toggle('icon-search');
    validarCambioIcono(iconSearch);

}


//busca gifos segun texto
function buscarSeleccion(word) {

    const border = document.getElementById("border");
    const trendingName = document.getElementById("trending-result-name");
    let sinDatosCont = document.getElementById('galeria-sin-datos');

    resultSearch.style.display = "block";
    border.style.display = "block";

    if (trendingName.innerHTML != word) {
        page = 0;
        trendingResultGallery.innerHTML = '';
    }

    if (sinDatosCont != null) {
        sinDatosCont.style.display = 'none';
    }

    //busco los gifs para la galeria

    trendingName.innerHTML = word;

    api = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${word}&limit=12&offset=${page}`;

    gestUserData(api)
        .then(response => {

            response.data.forEach(element => {

                let imgGif = {
                    url: element.images.fixed_height_downsampled.url,
                    width: element.images.fixed_height_downsampled.width,
                    height: element.images.fixed_height_downsampled.height,
                    id: element.id,
                    username: element.username,
                    title: element.title
                }


                mostrarGaleria(imgGif, 'S');

            });
            page += 13;
            if (searchInput.value != '') {
                activarAutocompletar();
            }
            if (response.data.length == 0) {



                if (sinDatosCont == null) {
                    sinDatosCont = document.createElement("div");
                    sinDatosCont.setAttribute("class", "galeria-sin-datos");
                    sinDatosCont.setAttribute("id", `galeria-sin-datos`);
                    trendingResultGallery.appendChild(sinDatosCont);

                    const imgSinDatos = document.createElement("img");
                    imgSinDatos.setAttribute("src", "assets/img/icon-busqueda-sin-resultado.svg");
                    sinDatosCont.appendChild(imgSinDatos);

                    const txtSinDatos = document.createElement("span");
                    txtSinDatos.setAttribute("id", "texto-sin-datos");
                    txtSinDatos.innerHTML = 'Intenta con otra búsqueda.'
                    sinDatosCont.appendChild(txtSinDatos);
                } else {
                    sinDatosCont.style.display = 'flex'
                }

            }
            if (response.data.length < 12) {
                verMasBtn.style.display = 'none';
            }

        })
        .catch(reason => {
            trendingResultGallery.innerHTML = `Error getting gallery: ${reason}`;
            console.log(`Error getting gallery: ${reason}`);
        });

}

//autocompleta la busqueda
function autocompletar(term) {
    api = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${term}`;
    let autocompleteList = document.getElementById("autocomplete-list");
    let primero = 0;

    if (autocompleteList != null) {
        autocompleteList.innerHTML = ``;
    }

    gestUserData(api)
        .then(response => {
            response.data.forEach(element => {

                if (primero == 0 && autocompleteList != null) {
                    autocompleteList.innerHTML = ``;
                    primero = 1;
                }
                if (autocompleteList == null) {
                    activarAutocompletar();
                    autocompleteList = document.getElementById("autocomplete-list");
                    autocompleteList.innerHTML = '';
                }

                autocompleteList.innerHTML += `<li class="autocomplete-list-item" onclick="buscarSeleccion('${element.name}')"><i class="fa fa-search fa-search-icon"
                aria-hidden="true"></i>${element.name}</li>`;

            });

        })
        .catch(reason => {
            console.log(reason);
            autocompleteList.innerHTML = `<li class="autocomplete-list-item"><i class="fa fa-search fa-search-icon"
            aria-hidden="true">${reason}</li>`;

        });
}

//adiciona imagen a favoritos
function adicionarFavImagen() {
    const iconFavActive = document.getElementById("fav-img-active");
    const iconFav = document.getElementById("fav-img");
    iconFavActive.style.display = "flex";
    iconFav.style.display = "none";
}

//borrar imagen de favoritos
function borrarFavImagen() {
    const iconFavActive = document.getElementById("fav-img-active");
    const iconFav = document.getElementById("fav-img");
    iconFavActive.style.display = "none";
    iconFav.style.display = "block";
}

function editarFavImagen() {
    let favs = JSON.parse(localStorage.getItem("favs"));
    let favsDatos = JSON.parse(localStorage.getItem("favsDatos"));
    let exist;
    if (favs === null) {
        favs = [gifActual.id];
        favsDatos = [gifActual];
        localStorage.setItem('favs', JSON.stringify(favs));
        localStorage.setItem('favsDatos', JSON.stringify(favsDatos));
        return true;
    }
    else {

        exist = favs.indexOf(gifActual.id);
        if (exist < 0) {
            favs.push(gifActual.id);
            favsDatos.push(gifActual);
            localStorage.setItem('favs', JSON.stringify(favs));
            localStorage.setItem('favsDatos', JSON.stringify(favsDatos));
            return true;
        }
        else {
            favs.splice(exist, 1);
            favsDatos.splice(exist, 1);
            localStorage.setItem('favs', JSON.stringify(favs));
            localStorage.setItem('favsDatos', JSON.stringify(favsDatos));
            return false;
        }

    }
}

// Adiciona o elimina el favorito en una tarjeta
function editarFavTarjeta(img) {

    gifActual.id = img.id;
    gifActual.title = img.title;
    gifActual.username = img.username;
    gifActual.url = img.url;
    gifActual.width = img.width;
    gifActual.height = img.height;
    const aFav = document.getElementById(`fav_${img.id}`);
    const liFav = document.getElementById(`liFav_${img.id}`)
    const aFavS = document.getElementById(`favS_${img.id}`);
    const liFavS = document.getElementById(`liFavS_${img.id}`)
    const aFavF = document.getElementById(`favF_${img.id}`);
    const liFavF = document.getElementById(`liFavF_${img.id}`)
    const resultado = editarFavImagen();

    if (aFav !== null) {
        liFav.classList.toggle('fav-active')
        aFav.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;

    }

    if (aFavS !== null) {
        liFavS.classList.toggle('fav-active')
        aFavS.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;

        if (savedFavorites.style.display != 'none' && savedFavorites.style.display != '') {
            mostrarFavoritos();
        }
    }

    if (aFavF !== null) {
        liFavF.classList.toggle('fav-active')
        aFavF.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;

        if (savedFavorites.style.display != 'none' && savedFavorites.style.display != '') {
            mostrarFavoritos();
        }
    }



}

//validar fav de gif
function validarFavGif(idGif) {
    let favs = JSON.parse(localStorage.getItem("favs"));
    let exist;
    if (favs === null) {
        return false;
    }
    else {
        exist = favs.indexOf(idGif);
        if (exist < 0) {
            return false;
        }
        else {
            return true;
        }

    }
}

/** Muestra la tarjeta con el gif cuando se selecciona */
function mostrarTarjetaGif(idGif) {
    const gifCard = document.getElementById("gif-card");
    const gifCardImg = document.getElementById("gif-card-img");
    const user = document.getElementById("user");
    const title = document.getElementById("title");
    const gifCardContainer = document.getElementById("gif-card-container");

    idGif = idGif.replace("desk_", "");
    idGif = idGif.replace("slider_", "");
    idGif = idGif.replace("img_", "");
    idGif = idGif.replace("search_", "");

    //Busco el gift para la card
    api = `https://api.giphy.com/v1/gifs/${idGif}?api_key=${apiKey}`;
    gifCardImg.innerHTML = " ";

    gestUserData(api)
        .then(response => {

            gifCardImg.innerHTML = `<img src="${response.data.images.original.url}" alt="${response.data.title}">`;
            user.innerHTML = response.data.username;
            title.innerHTML = response.data.title;
            gifCardContainer.style.width = `${response.data.images.original.width}px`;

            gifActual.id = idGif;
            gifActual.title = response.data.title;
            gifActual.url = response.data.images.original.url;
            gifActual.username = response.data.username;
            gifActual.width = response.data.images.original.width;
            gifActual.height = response.data.images.original.height;

            validarFavGif(idGif) ? adicionarFavImagen() : borrarFavImagen();
        })
        .catch(reason => {
            gifCardImg.innerHTML = `Error getting gif: ${reason}`;
            console.log(reason);
        });

    gifCard.style.display = "flex";

}

function hiddenGifCard() {
    const gifCard = document.getElementById("gif-card");
    gifCard.style.display = "none";
}

// crear gifs de trending
function crearTrending(imgGif) {
    const slider = document.getElementById("slider-container");

    let elem = document.createElement("div");
    elem.setAttribute("class", "item-trending");
    elem.setAttribute("width", `"${imgGif.width}px"`);
    elem.setAttribute("id", `slider_${imgGif.id}`);
    slider.appendChild(elem);

    const divImg = document.getElementById(`slider_${imgGif.id}`);

    let elem2 = document.createElement("img");
    elem2.setAttribute("src", imgGif.url);
    elem2.setAttribute("width", `"${imgGif.width}px"`);
    elem2.setAttribute("height", `"${imgGif.height}px"`);
    divImg.appendChild(elem2);

    divImg.addEventListener("click", e => {
        mostrarTarjetaGif(`slider_${imgGif.id}`);
    });
}

//Muestra imagenes en el slider desktop
function mostrarTrendingItem(imgGif) {

    let aHTML;

    const elemContenedor = document.createElement("div");
    elemContenedor.setAttribute("class", "item-trending-desktop");
    elemContenedor.setAttribute("width", `"${imgGif.width}px"`);
    elemContenedor.setAttribute("height", `"${imgGif.height}px"`);
    elemContenedor.setAttribute("id", `desk_${imgGif.id}`);
    sliderContainerDesktop.appendChild(elemContenedor);

    const divImg = document.getElementById(`desk_${imgGif.id}`);

    const elemImg = document.createElement("img");
    elemImg.setAttribute("src", imgGif.url);
    elemImg.setAttribute("width", `"100%"`);
    elemImg.setAttribute("height", `"${imgGif.height}px"`);
    divImg.appendChild(elemImg);


    const elemDivOver = document.createElement("div");
    elemDivOver.setAttribute("class", "gif-card-over");
    elemDivOver.setAttribute("height", `"${imgGif.height}px"`);
    elemDivOver.setAttribute("id", `over_${imgGif.id}`);

    const elemUL = document.createElement('ul');

    const elemLiFav = document.createElement('li');
    elemLiFav.setAttribute("id", `liFav_${imgGif.id}`);

    const aFav = document.createElement('a');
    aFav.setAttribute("id", `fav_${imgGif.id}`);

    if (validarFavGif(imgGif.id)) {
        elemLiFav.setAttribute("class", "fav-active");
        aHTML = `<img src="assets/img/icon-fav-active.svg" alt="" >`;
    } else {
        aHTML = `<img src="assets/img/icon-fav.svg" alt="" >`;
    }

    aFav.innerHTML = aHTML;

    elemLiFav.appendChild(aFav);

    const elemLiDownload = document.createElement('li');

    const aDownload = document.createElement('a');
    aDownload.setAttribute("id", `download_${imgGif.id}`);

    aHTML = `<img src="assets/img/icon-download.svg" alt="">`;

    aDownload.innerHTML = aHTML;
    elemLiDownload.appendChild(aDownload);

    const elemLiMax = document.createElement('li');

    const aMax = document.createElement('a');
    aMax.setAttribute("id", `max_${imgGif.id}`);

    aHTML = `<img src="assets/img/icon-max-normal.svg" alt="">`;

    aMax.innerHTML = aHTML;
    elemLiMax.appendChild(aMax);

    elemUL.appendChild(elemLiFav);
    elemUL.appendChild(elemLiDownload);
    elemUL.appendChild(elemLiMax);
    elemDivOver.appendChild(elemUL);

    elemDivOver.innerHTML += `<div>
    <span>${imgGif.username}<br>${imgGif.title}
    </span>
</div>`;


    divImg.appendChild(elemDivOver);

    const afavEvento = document.getElementById(`fav_${imgGif.id}`);
    const aDLEvent = document.getElementById(`download_${imgGif.id}`);
    const aMaxEvent = document.getElementById(`max_${imgGif.id}`);


    afavEvento.addEventListener('click', e => {
        editarFavTarjeta(imgGif);
    });

    aDLEvent.addEventListener('click', e => {
        gifActual.title = imgGif.title;
        gifActual.id = imgGif.id;
        gifActual.username = imgGif.username;
        gifActual.url = imgGif.url;
        gifActual.width = imgGif.width;
        gifActual.height = imgGif.height;
        descargarImagen();
    })

    aMaxEvent.addEventListener('click', e => {
        mostrarTarjetaGif(`desk_${imgGif.id}`);
    })

    elemContenedor.addEventListener('mouseenter', e => {

        elemDivOver.style.display = 'flex';


    });

    elemContenedor.addEventListener('mouseleave', e => {
        elemDivOver.style.display = 'none';
    });
}

function eliminarGifo(imgGif) {

    let misGifos = JSON.parse(localStorage.getItem("misGifos"));
    if (misGifos != null) {
        let exist = misGifos.indexOf(imgGif.id);
        if (exist >= 0) {
            misGifos.splice(exist, 1);
            localStorage.setItem('misGifos', JSON.stringify(misGifos));
            paginaMisGifos = 0;
            mostrarMisGifos();
        }
    }

}

//Muestra gifs resultantes de la busqueda
function mostrarGaleria(imgGif, tipo) {
    let aHTML;
    let idOver;
    let divImg;

    const elemContenedor = document.createElement("div");
    elemContenedor.setAttribute("class", "item-trending-search");
    elemContenedor.setAttribute("width", `"${imgGif.width}px"`);
    elemContenedor.setAttribute("height", `${imgGif.height}px`);

    if (tipo == 'S') {
        elemContenedor.setAttribute("id", `search_${imgGif.id}`);
        trendingResultGallery.appendChild(elemContenedor);
        divImg = document.getElementById(`search_${imgGif.id}`);
        idOver = `over_search_${imgGif.id}`;

    } else if (tipo == 'F') {
        elemContenedor.setAttribute("id", `favs_${imgGif.id}`);
        saveFavoritesGallery.appendChild(elemContenedor);
        divImg = document.getElementById(`favs_${imgGif.id}`);
        idOver = `over_favs_${imgGif.id}`;

    } else if (tipo == 'M') {
        elemContenedor.setAttribute("id", `mg_${imgGif.id}`);
        misGifosGallery.appendChild(elemContenedor);
        divImg = document.getElementById(`mg_${imgGif.id}`);
        idOver = `over_mg_${imgGif.id}`;
    }


    const elemImg = document.createElement("img");
    elemImg.setAttribute("src", imgGif.url);
    elemImg.setAttribute("width", `"100%"`);
    elemImg.setAttribute("height", `${imgGif.height}px`);
    divImg.appendChild(elemImg);

    const elemDivOver = document.createElement("div");
    elemDivOver.setAttribute("class", "gif-card-over");
    elemDivOver.setAttribute("height", `${imgGif.height}px`);
    elemDivOver.setAttribute("id", idOver);

    const elemUL = document.createElement('ul');

    const elemLiFav = document.createElement('li');
    const aFav = document.createElement('a');
    const elemLiEliminar = document.createElement('li');
    const aEliminar = document.createElement('a');

    if (tipo != 'M') {

        elemLiFav.setAttribute("id", `liFav${tipo}_${imgGif.id}`);

        aFav.setAttribute("id", `fav${tipo}_${imgGif.id}`);

        if (validarFavGif(imgGif.id)) {
            elemLiFav.setAttribute("class", "fav-active");
            aHTML = `<img src="assets/img/icon-fav-active.svg" alt="" >`;
        } else {
            aHTML = `<img src="assets/img/icon-fav.svg" alt="" >`;
        }

        aFav.innerHTML = aHTML;

        elemLiFav.appendChild(aFav);
    } else {

        aEliminar.setAttribute("id", `eliminar${tipo}_${imgGif.id}`);

        aHTML = `<img src="assets/img/icon-trash-normal.svg" alt="">`;

        aEliminar.innerHTML = aHTML;
        elemLiEliminar.appendChild(aEliminar);
    }


    const elemLiDownload = document.createElement('li');

    const aDownload = document.createElement('a');
    aDownload.setAttribute("id", `download${tipo}_${imgGif.id}`);

    aHTML = `<img src="assets/img/icon-download.svg" alt="">`;

    aDownload.innerHTML = aHTML;
    elemLiDownload.appendChild(aDownload);

    const elemLiMax = document.createElement('li');

    const aMax = document.createElement('a');
    aMax.setAttribute("id", `max${tipo}_${imgGif.id}`);

    aHTML = `<img src="assets/img/icon-max-normal.svg" alt="">`;

    aMax.innerHTML = aHTML;
    elemLiMax.appendChild(aMax);

    tipo == 'M' ? elemUL.appendChild(elemLiEliminar) : elemUL.appendChild(elemLiFav);
    elemUL.appendChild(elemLiDownload);
    elemUL.appendChild(elemLiMax);
    elemDivOver.appendChild(elemUL);

    elemDivOver.innerHTML += `<div>
    <span>${imgGif.username}<br>${imgGif.title}
    </span>
</div>`;

    divImg.appendChild(elemDivOver);


    const aDLEvent = document.getElementById(`download${tipo}_${imgGif.id}`);
    const aMaxEvent = document.getElementById(`max${tipo}_${imgGif.id}`);

    if (tipo != 'M') {
        const afavEvento = document.getElementById(`fav${tipo}_${imgGif.id}`);

        afavEvento.addEventListener('click', e => {
            editarFavTarjeta(imgGif);
        });
    } else {
        const aMGEvento = document.getElementById(`eliminar${tipo}_${imgGif.id}`);

        aMGEvento.addEventListener('click', e => {
            eliminarGifo(imgGif);
        });
    }



    aDLEvent.addEventListener('click', e => {
        gifActual.title = imgGif.title;
        gifActual.id = imgGif.id;
        gifActual.username = imgGif.username;
        gifActual.url = imgGif.url;
        gifActual.width = imgGif.width;
        gifActual.height = imgGif.height;
        descargarImagen();
    })

    aMaxEvent.addEventListener('click', e => {
        mostrarTarjetaGif(`search_${imgGif.id}`);
    })

    elemContenedor.addEventListener('mouseenter', e => {

        matchMedia('(pointer:coarse)').matches ? mostrarTarjetaGif(`search_${imgGif.id}`) : elemDivOver.style.display = 'flex';

    });

    elemContenedor.addEventListener('mouseleave', e => {
        elemDivOver.style.display = 'none';
    });
}


// mostrar slider de trending
function mostrarTrending(sliderDesktop) {

    for (i = 0; i < sliderActuales.length; i++) {
        mostrarTrendingItem(sliderDesktop[sliderActuales[i]]);
    }


}


//llena el slider con los gif correspondientes a trending
function inicialzarSlider() {

    api = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12&rating=g`;

    gestUserData(api)
        .then(response => {
            let imgGif;
            response.data.forEach(element => {

                imgGif = {
                    url: element.images.fixed_height_downsampled.url,
                    width: element.images.fixed_height_downsampled.width,
                    height: element.images.fixed_height_downsampled.height,
                    id: element.id,
                    username: element.username,
                    title: element.title
                }

                let proportion;
                let width;
                let height;

                if (imgGif.height > 200) {
                    proportion = (imgGif.height - 200) * 100 / imgGif.height;
                    height = 150;
                    width = imgGif.width - (imgGif.width * (proportion / 100));

                }

                crearTrending(imgGif);
                sliderDesktop.push(imgGif);
            });
            sliderActuales.push(0);
            sliderActuales.push(1);
            if (sliderDesktop[0].width * 1 +
                sliderDesktop[1].width * 1 +
                sliderDesktop[2].width * 1 +
                sliderDesktop[3].width * 1 <= 800) {
                sliderActuales.push(2);
            }
            sliderPage += mostrarTrending(sliderDesktop);
        })
        .catch(reason => {
            drawError(`Error getting data ${reason}`, "horizontal-slider");
            drawError(`Error getting data ${reason}`, "horizontal-slider-desktop");
        });

}

function actualizarFavTarjeta() {
    const aFav = document.getElementById(`fav_${gifActual.id}`);
    const liFav = document.getElementById(`liFav_${gifActual.id}`)
    const aFavS = document.getElementById(`favS_${gifActual.id}`);
    const liFavS = document.getElementById(`liFavS_${gifActual.id}`)
    const aFavF = document.getElementById(`favF_${gifActual.id}`);
    const liFavF = document.getElementById(`liFavF_${gifActual.id}`)
    const resultado = editarFavImagen();

    resultado ? adicionarFavImagen() : borrarFavImagen();

    if (aFav !== null) {
        liFav.classList.toggle('fav-active')
        aFav.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;
        if (savedFavorites.style.display != 'none' && savedFavorites.style.display != '') {
            mostrarFavoritos();
        }
    }

    if (aFavS !== null) {
        liFavS.classList.toggle('fav-active')
        aFavS.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;

        if (savedFavorites.style.display != 'none' && savedFavorites.style.display != '') {
            mostrarFavoritos();
        }
    }

    if (aFavF !== null) {
        liFavF.classList.toggle('fav-active')
        aFavF.innerHTML = resultado ? `<img src="assets/img/icon-fav-active.svg" alt="" >` : `<img src="assets/img/icon-fav.svg" alt="" >`;
        mostrarFavoritos();
    }
}

function favoritosSinDatos(favsDatos) {
    const imgSinFav = document.createElement("img");
    imgSinFav.setAttribute("src", "assets/img/icon-fav-sin-contenido.svg");
    imgSinFav.setAttribute("width", `150px`);
    saveFavoritesGallery.appendChild(imgSinFav);
    const spanSinFav = document.createElement("span");
    spanSinFav.innerHTML = '¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!';
    saveFavoritesGallery.appendChild(spanSinFav);
    saveFavoritesGallery.style.flexDirection = 'column';
    saveFavoritesGallery.style.alignContent = 'center';
    verMasBtnFav.style.display = 'none';


}

function mostrarGifsFavoritos() {

    let favsDatos = JSON.parse(localStorage.getItem("favsDatos"));
    let paginaFinal = 0;


    if (favsDatos == null) {
        favoritosSinDatos(favsDatos);
    } else if (favsDatos.length == 0) {
        favoritosSinDatos(favsDatos);
    } else if (favsDatos.length <= 12) {
        favsDatos.forEach(gif => {
            let imgGif = {
                url: gif.url,
                width: gif.width,
                height: '200px',
                id: gif.id,
                username: gif.username,
                title: gif.title
            }

            mostrarGaleria(imgGif, 'F');
        })
        verMasBtnFav.style.display = 'none';
    } else {
        if (paginaFavoritos == 0) {
            paginaFinal = 12;
            verMasBtnFav.style.display = 'inline-block';
        }
        else if (paginaFavoritos + 12 >= favsDatos.length) {
            paginaFinal = favsDatos.length;
            verMasBtnFav.style.display = 'none';
        }
        else if (paginaFavoritos + 12 < favsDatos.length) {
            paginaFinal = paginaFavoritos + 12;
            verMasBtnFav.style.display = 'inline-block';
        }

        for (i = paginaFavoritos; i < paginaFinal; i++) {
            let imgGif = {
                url: favsDatos[i].url,
                width: favsDatos[i].width,
                height: '200px',
                id: favsDatos[i].id,
                username: favsDatos[i].username,
                title: favsDatos[i].title
            }

            mostrarGaleria(imgGif, 'F');

        }

        paginaFavoritos = paginaFinal;

    }
}

function mostrarMisGifos() {
    let misGifos = JSON.parse(localStorage.getItem("misGifos"));
    let paginaFinal = 0;
    let ids;
    let datosMisGifos = [];



    if (paginaMisGifos == 0) {
        misGifosGallery.innerHTML = '';
    }


    if (misGifos == null) {
        const imgSinGifos = document.createElement("img");
        const spanSinGifos = document.createElement("span");
        imgSinGifos.setAttribute("src", "assets/img/icon-mis-gifos-sin-contenido.svg");
        imgSinGifos.setAttribute("width", `150px`);
        misGifosGallery.appendChild(imgSinGifos);

        spanSinGifos.innerHTML = '¡Anímate a crear tu primer GIFO!';
        misGifosGallery.appendChild(spanSinGifos);
        misGifosGallery.style.flexDirection = 'column';
        misGifosGallery.style.alignContent = 'center';
        verMasBtnMisgif.style.display = 'none';

    } else {

        ids = misGifos.toString();

        api = `https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${ids}`;

        gestUserData(api)
            .then(response => {

                let imgGif;
                response.data.forEach(element => {

                    imgGif = {
                        url: element.images.fixed_height_downsampled.url,
                        width: element.images.fixed_height_downsampled.width,
                        height: element.images.fixed_height_downsampled.height,
                        id: element.id,
                        username: element.username,
                        title: element.title
                    }



                    datosMisGifos.push(imgGif);
                });


                if (datosMisGifos.length <= 12) {
                    datosMisGifos.forEach(gif => {
                        let imgGif = {
                            url: gif.url,
                            width: gif.width,
                            height: '200px',
                            id: gif.id,
                            username: gif.username,
                            title: gif.title
                        }

                        mostrarGaleria(imgGif, 'M');
                    });
                    verMasBtnMisgif.style.display = 'none';
                } else {
                    if (paginaMisGifos == 0) {
                        paginaFinal = 12;
                        verMasBtnMisgif.style.display = 'inline-block';
                    }
                    else if (paginaMisGifos + 12 >= datosMisGifos.length) {
                        paginaFinal = datosMisGifos.length;
                        verMasBtnMisgif.style.display = 'none';
                    }
                    else if (paginaMisGifos + 12 < datosMisGifos.length) {
                        paginaFinal = paginaMisGifos + 12;
                        verMasBtnMisgif.style.display = 'inline-block';
                    }

                    for (i = paginaMisGifos; i < paginaFinal; i++) {
                        let imgGif = {
                            url: datosMisGifos[i].url,
                            width: datosMisGifos[i].width,
                            height: '200px',
                            id: datosMisGifos[i].id,
                            username: datosMisGifos[i].username,
                            title: datosMisGifos[i].title
                        }

                        mostrarGaleria(imgGif, 'M');

                    }

                    paginaMisGifos = paginaFinal;

                }

            })
            .catch(reason => {
                drawError(`Error getting data ${reason}`, "mis-gifos-gallery");
                console.log(reason);
            });
    }
}

//reinicializa el estilo de las opciones del menu
function restaurarMenus() {
    const addGifoMnu = document.getElementById('add-Gifo-mnu');
    const favMnu = document.getElementById('fav-mnu-desk');
    const misgifMnu = document.getElementById('misgif-mnu');


    addGifoMnu.style.pointerEvents = 'auto';
    favMnu.style.pointerEvents = 'auto';
    misgifMnu.style.pointerEvents = 'auto';
    favMnu.classList.remove("menu-activo");
    misgifMnu.classList.remove("menu-activo");

    addGifoMnu.classList.remove('add-Gifo');
}

//ocultar todas las secciones 
function ocultarSecciones() {
    const lanzador = document.getElementById("lanzador");
    const headerSite = document.getElementsByTagName("header");

    savedFavorites.style.display = "none";
    misGifosSeccion.style.display = 'none';
    creacionGif.style.display = 'none';
    trending.style.display = "none";
    trendingGifos.style.display = 'none';
    lanzador.checked = false;


    for (i = 0; i < headerSite.length; i++) {
        headerSite[i].style.display = "none";
    }

    paginaMisGifos = 0;
}

//Muestra la pagina de favoritos
function mostrarFavoritos() {
    const favMnu = document.getElementById('fav-mnu-desk');

    restaurarMenus();
    ocultarSecciones()
    savedFavorites.style.display = "flex";
    trendingGifos.style.display = 'block';
    favMnu.style.pointerEvents = 'none';
    favMnu.classList.add("menu-activo");

    paginaFavoritos = 0;
    saveFavoritesGallery.innerHTML = '';
    mostrarGifsFavoritos();

}

//Mostrar pagina inicio
function mostrarHome() {
    const headerSite = document.getElementsByTagName("header");

    restaurarMenus();
    ocultarSecciones();

    trending.style.display = "block";
    trendingGifos.style.display = 'block';

    for (i = 0; i < headerSite.length; i++) {
        headerSite[i].style.display = "block";
    }
}

function mostrarSeccionMisGifos() {
    const misgifMnu = document.getElementById('misgif-mnu');

    restaurarMenus();
    ocultarSecciones();
    misgifMnu.style.pointerEvents = 'none';

    misGifosSeccion.style.display = 'flex';
    trendingGifos.style.display = 'block';
    misgifMnu.classList.add("menu-activo");

    paginaFavoritos = 0;
    saveFavoritesGallery.innerHTML = '';
    mostrarMisGifos();


}

function mostrarCreacionGifos() {
    const addGifoMnu = document.getElementById('add-Gifo-mnu');
    const tituloPaso = document.getElementById('titulo-paso');
    const descripcionPaso = document.getElementById('descripcion-paso');
    const contenidoCamara = document.getElementById('contenido-camara');

    restaurarMenus();
    ocultarSecciones();
    addGifoMnu.style.pointerEvents = 'none';
    addGifoMnu.classList.add('add-Gifo');

    paso1.classList.remove('pasos-btn-act');
    paso2.classList.remove('pasos-btn-act');
    paso3.classList.remove('pasos-btn-act');
    paso1.style.pointerEvents = 'none';
    paso2.style.pointerEvents = 'none';
    paso3.style.pointerEvents = 'none';

    contenidoCamara.style.display = 'none';

    tituloPaso.innerHTML = 'Aquí podrás crear tus propios <span>GIFOS</span>';
    descripcionPaso.innerHTML = '¡Crea tu GIFO en sólo 3 pasos! <br> (sólo necesitas una cámara para grabar un video)';
    tituloPaso.style.display = 'block';
    descripcionPaso.style.display = 'block';

    btnCreacion.style.display = 'block';
    btnCreacion.value = 'Comenzar';



    videoContainer.srcObject = null;

    creacionGif.style.display = 'grid';

}

function descargarImgCreada(idGif) {
    api = `https://api.giphy.com/v1/gifs/${idGif}?api_key=${apiKey}`;

    gestUserData(api)
        .then(response => {

            gifActual.id = idGif;
            gifActual.title = response.data.title;
            gifActual.url = response.data.images.original.url;
            gifActual.username = response.data.username;
            gifActual.width = response.data.images.original.width;
            gifActual.height = response.data.images.original.height;

            descargarImagen();

        })
        .catch(reason => {
            drawError(`Error descargando imagen ${reason}`, "contenido-camara");
            console.log(reason);
        });
}

function crearTarjetaMiGifo(imgGif) {
    let aHTML;
    let idOver;

    imgContainer.setAttribute("class", "item-card-new");
    imgElement.setAttribute("id", `new_${imgGif}`);
    idOver = `over_new_${imgGif}`;

    const elemDivOver = document.createElement("div");
    elemDivOver.setAttribute("class", "gif-card-new");

    elemDivOver.setAttribute("height", `100%`);
    elemDivOver.setAttribute("id", idOver);

    const elemUL = document.createElement('ul');

    const elemLiDownload = document.createElement('li');

    const aDownload = document.createElement('a');
    aDownload.setAttribute("id", `downloadNew_${imgGif}`);

    aHTML = `<img src="assets/img/icon-download.svg" alt="">`;

    aDownload.innerHTML = aHTML;
    elemLiDownload.appendChild(aDownload);

    const elemLiCopy = document.createElement('li');

    const aCopy = document.createElement('a');
    aCopy.setAttribute("id", `copyNew_${imgGif}`);

    aHTML = `<img src="assets/img/icon-link-normal.svg" alt="">`;

    aCopy.innerHTML = aHTML;
    elemLiCopy.appendChild(aCopy);

    elemUL.appendChild(elemLiDownload);
    elemUL.appendChild(elemLiCopy);
    elemDivOver.appendChild(elemUL);

    elemDivOver.innerHTML += `<div>
    <img src="assets/img/check.svg" alt="" id="check"><br>
    <span>GIFO subido con exito
    </span>
</div>`;

    imgContainer.appendChild(elemDivOver);

    elemDivOver.style.display = 'grid';

    const aDLEvent = document.getElementById(`downloadNew_${imgGif}`);
    const aCopyEvent = document.getElementById(`copyNew_${imgGif}`);

    aDLEvent.addEventListener('click', e => {

        descargarImgCreada(imgGif);
    })

    aCopyEvent.addEventListener('click', e => {

        navigator.clipboard.writeText(`https://giphy.com/gifs/${imgGif}`)
            .then(() => {
                console.log("Link copiado...")
            })
            .catch(err => {
                console.log('Error: ', err);
            })
    })

}

function adicionarGif(idGif) {
    let misGifos = JSON.parse(localStorage.getItem("misGifos"));
    let exist;
    if (misGifos === null) {
        misGifos = [idGif];
        localStorage.setItem('misGifos', JSON.stringify(misGifos));
        return true;
    }
    else {
        exist = misGifos.indexOf(idGif);
        if (exist < 0) {
            misGifos.push(idGif);
            localStorage.setItem('misGifos', JSON.stringify(misGifos));
            return true;
        }
        else {
            misGifos.splice(exist, 1);
            localStorage.setItem('misGifos', JSON.stringify(misGifos));
            return false;
        }

    }
}

function subirGif() {
    api = `https://upload.giphy.com/v1/gifs`;

    form.append('api_key', apiKey);
    fetch(api, {
        method: 'POST',
        body: form
    })
        .then(response => response.json())
        .then(response => {

            adicionarGif(response.data.id);
            crearTarjetaMiGifo(response.data.id);
        })
        .catch(error => console.error('Error:', error));


}

function reiniciarGrabacion() {
    const opcionesExtras = document.getElementById('opciones-extras');
    const tiempo = document.getElementById('tiempo');
    const repetirLink = document.getElementById('repetirLink');
    const divOver = document.getElementsByClassName('gif-card-new');

    opcionesExtras.style.display = 'none';
    tiempo.style.display = 'none';
    tiempo.innerHTML = '00:00:00';
    repetirLink.style.display = 'none';
    is_recording = false;
    imgContainer.style.display = 'none';
    btnCreacion.value = 'Comenzar';
    btnCreacion.style.display = 'block';
    videoContainer.style.display = 'block';

    for (i = 0; i < divOver.length; i++) {
        imgContainer.removeChild(divOver[i]);
    }

}

function repetirGrabacion() {
    let cam_options = {
        audio: false,
        video: {
            width: { max: 450 },
            height: { max: 430 }
        }
    };



    if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("No camera");
    }

    navigator.mediaDevices.getUserMedia(cam_options)
        .then((response) => {
            camera = response;
            console.log('acepta permiso');
            camara = camera;
            activarCamara();


        })
        .catch(err => {
            alert('Permiso denegado, no es posible continuar con la creación del gif');
            throw new Error(err);

        });
}

function pararGrabacion() {

    const opcionesExtras = document.getElementById('opciones-extras');
    const tiempo = document.getElementById('tiempo');
    const repetirLink = document.getElementById('repetirLink');

    opcionesExtras.style.display = 'block';
    tiempo.style.display = 'none';
    repetirLink.style.display = 'block';

    recorder.camera.stop();

    clearInterval(tempGif);

    blob = recorder.getBlob();
    form = new FormData();
    form.append("file", blob, 'myGif.gif');

    src = URL.createObjectURL(blob);
    imgElement.src = src;

    recorder.destroy();
    recorder = null;
    videoContainer.pause();
    videoContainer.style.display = 'none';
    videoContainer.srcObject = null;
    imgContainer.style.display = 'block';
    btnCreacion.value = 'SUBIR GIFO';

    is_recording = false;


}

function actualizarTiempo() {
    const tiempo = document.getElementById('tiempo');

    if (tiempoGif == 20) {
        pararGrabacion()
    } else if (tiempoGif < 10) {
        tiempo.innerHTML = `00:00:0${tiempoGif}`;
        if (tiempoGif == 2) {
            btnCreacion.value = 'FINALIZAR';
            btnCreacion.style.display = 'block';
        }
    } else {
        tiempo.innerHTML = `00:00:${tiempoGif}`;
    }

    tiempoGif++;
}

function grabarGif() {

    let recorder_options = {
        type: "gif"
    };

    const opcionesExtras = document.getElementById('opciones-extras');
    const tiempo = document.getElementById('tiempo');
    const repetirLink = document.getElementById('repetirLink');

    opcionesExtras.style.display = 'block';
    tiempo.style.display = 'block';
    repetirLink.style.display = 'none';

    recorder = RecordRTC(camara, recorder_options);
    recorder.startRecording();
    recorder.camera = camara;
    is_recording = true;

    tiempoGif = 0;
    tempGif = setInterval(actualizarTiempo, 1000);


}

function activarCamara() {

    reiniciarGrabacion();

    const contenidoCamara = document.getElementById('contenido-camara');
    document.getElementById('titulo-paso').style.display = 'none';
    document.getElementById('descripcion-paso').style.display = 'none';
    paso2.classList.add('pasos-btn-act');
    paso1.classList.remove('pasos-btn-act')
    btnCreacion.style.display = 'block';
    btnCreacion.value = 'GRABAR';
    paso2.style.pointerEvents = 'none';




    if (videoContainer.srcObject == null) {
        videoContainer.srcObject = camara;
        playPromise = videoContainer.play();

        playPromise.then((response) => {
            contenidoCamara.style.display = 'block';
        }).catch((reason) => console.log('Error ejecutando play(): ', reason));

    }


}

function permisosCamara() {
    let cam_options = {
        audio: false,
        video: {
            width: { max: 450 },
            height: { max: 430 }
        }
    };



    if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("No camera");
    }

    navigator.mediaDevices.getUserMedia(cam_options)
        .then((response) => {
            camera = response;
            console.log('acepta permiso');
            camara = camera;
            activarCamara();


        })
        .catch(err => {
            alert('Permiso denegado, no es posible continuar con la creación del gif');
            throw new Error(err);

        });
}

//Eventos

searchInput.addEventListener("keyup", e => {

    if (e.keyCode != 13 && searchInput.value.length == 1) {
        if (!searchInput.classList.contains('search-input-list')) {
            activarAutocompletar();
        }
        autocompletar(searchInput.value);
    } else if (e.keyCode != 13 && searchInput.value.length > 1) {
        autocompletar(searchInput.value);
    } else if (e.keyCode == 13) {
        buscarSeleccion(searchInput.value);
    }


})


iconSearch.addEventListener("click", e => {

    if (iconSearch.classList.contains('icon-close-search')) {
        activarAutocompletar();

    }


});

verMasBtn.addEventListener("click", e => {
    const trendingName = document.getElementById("trending-result-name");
    buscarSeleccion(trendingName.innerHTML);
});

iconCloseCard.addEventListener("click", e => {
    hiddenGifCard()
    gifActual.id = '';
    gifActual.title = '';
    gifActual.url = '';
    gifActual.username = '';
    gifActual.width = '';
    gifActual.height = '';
});


favImg.addEventListener("click", e => {
    actualizarFavTarjeta()
});

favImgActive.addEventListener("click", e => {
    actualizarFavTarjeta()
});

downloadImg.addEventListener("click", e => {
    descargarImagen();
});

sliderRight.addEventListener("click", e => {

    let posicionActual = 0;
    sliderContainerDesktop.innerHTML = "";
    sliderRight.style.visibility = "visible";

    posicionActual = sliderActuales[sliderActuales.length - 1];

    sliderActuales = [];

    if (12 - (posicionActual + 1) >= 3) {
        sliderActuales.push(posicionActual + 1);
        sliderActuales.push(posicionActual + 2);


        if (sliderDesktop[posicionActual + 1].width * 1 +
            sliderDesktop[posicionActual + 2].width * 1 +
            sliderDesktop[posicionActual + 3].width * 1 <= 800) {
            sliderActuales.push(posicionActual + 3);
        }

        if (sliderActuales[sliderActuales.length - 1] >= 11) {
            sliderRight.style.visibility = "hidden";
        }
    } else {
        for (i = posicionActual + 1; i < 12; i++) {
            sliderActuales.push(i);
            sliderRight.style.visibility = "hidden";
        }
    }

    mostrarTrending(sliderDesktop);
    sliderLeft.style.visibility = "visible";

});

sliderLeft.addEventListener("click", e => {

    let posicionActual = 0;

    sliderContainerDesktop.innerHTML = "";
    sliderLeft.style.visibility = "visible";

    posicionActual = sliderActuales[0];

    sliderActuales = [];

    if (posicionActual >= 3) {
        sliderActuales.unshift(posicionActual - 1);
        sliderActuales.unshift(posicionActual - 2);
        if (sliderDesktop[posicionActual - 1].width * 1 +
            sliderDesktop[posicionActual - 2].width * 1 +
            sliderDesktop[posicionActual - 3].width * 1 <= 800) {
            sliderActuales.unshift(posicionActual - 3);
        }

        if (sliderActuales[0] <= 0) {
            sliderLeft.style.visibility = "hidden";
        }
    } else {
        for (i = posicionActual - 1; i >= 0; i--) {
            sliderActuales.unshift(i);
            sliderLeft.style.visibility = "hidden";
        }
    }

    mostrarTrending(sliderDesktop);
    sliderRight.style.visibility = "visible";


});

verMasBtnFav.addEventListener('click', e => {
    mostrarGifsFavoritos();
})

verMasBtnMisgif.addEventListener('click', e => {
    mostrarMisGifos();
})

btnCreacion.addEventListener('click', e => {
    const tituloPaso = document.getElementById('titulo-paso');
    const descripcionPaso = document.getElementById('descripcion-paso');
    const opcionesExtras = document.getElementById('opciones-extras');

    switch (btnCreacion.value) {
        case 'Comenzar':
            paso1.classList.add('pasos-btn-act');
            btnCreacion.style.display = 'none';
            tituloPaso.innerHTML = '¿Nos das acceso a tu cámara?';
            descripcionPaso.innerHTML = 'El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.';
            permisosCamara();
            break;
        case 'GRABAR':
            btnCreacion.style.display = 'none';
            grabarGif();
            break;
        case 'FINALIZAR':
            if (is_recording)
                recorder.stopRecording(pararGrabacion);
            break;
        case 'SUBIR GIFO':
            opcionesExtras.style.display = 'none';
            paso3.classList.add('pasos-btn-act');
            paso2.classList.remove('pasos-btn-act');
            paso1.classList.remove('pasos-btn-act');
            btnCreacion.style.display = 'none';
            subirGif();
            break;
    }
})

//iniciar
iniciarGifos();
