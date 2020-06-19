// const newUploadedFunction = () => {
//   const upload = document.querySelector("#uploadedimage");
//   // if new picture is uploaded, show new picture in 'old' place

//   // else, do nothing
// };

// get the upload file
// make sure that when you click select in finder or somewhere on the page that it shows the picture

// POP UP WHEN YOU LEAVE PAGE AND STILL HAVE UNSAVED CHANGES

let changed = false;

window.addEventListener("beforeunload", function (e) {
  if (changed) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "";
  }
});

// bron: https://developer.mozilla.org/nl/docs/Web/API/WindowEventHandlers/onbeforeunload

document.querySelectorAll("input").forEach(function (element) {
  element.addEventListener("keyup", function (event) {
    changed = true;
    console.log(event);
  });
});

document.querySelectorAll("form").forEach(function (element) {
  element.addEventListener("submit", function (event) {
    changed = false;
    console.log(event);
  });
});

// IMMEDIATELY SHOW NEW UPLOADED PROFILE PICTURE

document.querySelectorAll("input[type=file]").forEach(function (element) {
  element.addEventListener("change", function (event) {
    const reader = new FileReader(); // FileReader is eigenlijk een API van de browser waarmee je kan zeggen "Hey ik wil dit bestand uitlezen"
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
      document.getElementById("uploadedimage").src = e.target.result;
    };
  });
});

// bron: https://stackoverflow.com/questions/30424121/get-blob-image-from-file-input-using-jquery
