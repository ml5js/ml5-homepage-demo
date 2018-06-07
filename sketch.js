// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
Simple Image Classification Drag and Drop
=== */

const image = document.getElementById('image'); // The image we want to classify
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
let windowW = window.innerWidtt;
const fileInput = document.getElementById('fileUploader');

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

function windowResized() {
  if (windowW < 480) {
    image.style.maxWidth = windowW - 80;
  } else {
    image.style.maxWidth = '90%';
  }
}

['dragenter', 'dragover'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => image.classList.add('highlight'), false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => image.classList.remove('highlight'), false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, preventDefaults, false)
});

dropContainer.addEventListener('drop', gotImage, false)

function gotImage(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 1) {
    console.error('upload only one file');
  }
  const file = files[0];
  const imageType = /image.*/;
  if (file.type.match(imageType)) {
    warning.innerHTML = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      image.src = reader.result;
      setTimeout(classifyImage, 100);
    }
  } else {
    image.src = 'images/bird.jpg';
    warning.innerHTML = 'Please drop an image file.'
  }
}

function handleFiles() {
  const curFiles = fileInput.files;
  console.log('fileInput: ', fileInput);
  if (curFiles.length === 0) {
    image.src = 'images/bird.jpg';
    warning.innerHTML = 'No image selected for upload';
    console.log('warning.innerHTML: ', warning.innerHTML);
  } else {
    image.src = window.URL.createObjectURL(curFiles[0]);
    setTimeout(classifyImage, 100);
  }
}

function clickUploader() {
  fileInput.click();
}

const result = document.getElementById('result'); // The result tag in the HTML
const probability = document.getElementById('probability'); // The probability tag in the HTML

// Initialize the Image Classifier method
const classifier = new ml5.ImageClassifier();

// Make a prediction with the selected image
// This will return an array with a default of 10 options with their probabilities
classifyImage();

function classifyImage() {
  classifier.predict(image, results => {
    result.innerText = results[0].className;
    probability.innerText = results[0].probability;
  });
}
