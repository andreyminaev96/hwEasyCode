// Init User Service
const user = new UserService();
// Init User UI
const userUI = new UserUI();
//init Image Service
const image = new ImageService();
// Init Image UI
const imageUI = new ImageUI();

// UI elements
const elementImgRow =document.querySelector(".row");
const inputCover = document.getElementById("coverImg");
const inputUploadPhoto = document.getElementById("userPhotos");

//Функцыя для получения информаціи о польщователе с сервера
function onLoad(e) {
    user.getInfo()
        .then((data) => {
            userUI.clearContainer();
            userUI.renderUserInfo(data);
            return data;
        })
        .then((data) => {
            imageUI.clearContainer();
            data.my_images.forEach((img) => imageUI.addImage(img));
        })
        .catch((error) => {
            console.log(error);
        });
}

//Функцыя для добавления coverImg
function onCoverUpload(e) {
    if (inputCover.files.length) {
        const [newCover] = inputCover.files;
        user.uploadCover(newCover)
            .then(user.getInfo)
            .then((data) => userUI.setCover(data.cover))
            .catch((error) => {
                console.log(error);
            });
    }
}
//Функцыя для добавления фото на сервер
function onloadingPhoto(e) {
    if (inputUploadPhoto.files.length){
        const [newPhoto] = inputUploadPhoto.files;
        image.loadingPhoto(newPhoto)
          .then(() => onLoad())
          .catch((error) => console.log(error));
    }
}
//Функцыя для удаление фото из сервер
function deletePhoto(e) {

    if (e.target.closest('.remove-wrap')) {
        // UI elements
        const imgSrc = e.target.offsetParent.previousElementSibling;
        const imgWrap = e.target.offsetParent.previousElementSibling.parentElement;

            let questionDelete = confirm('Вы точно хотите удалить ето фото ?');

            if (questionDelete) {
                // elements imgID - id photo, imgUrl - url photo
                const imgId = imgWrap.dataset.imgId;
                const imgUrl = imgSrc.currentSrc.split('/')[5];
                image.removePhoto(imgId, imgUrl);
            }
            user.getInfo()
             .then(() => onLoad())
             .catch((error) => console.log(error));

    }

}

// Events
window.addEventListener("load", onLoad);
inputCover.addEventListener("change", onCoverUpload);
inputUploadPhoto.addEventListener("change", onloadingPhoto);
elementImgRow.addEventListener('click', deletePhoto);

