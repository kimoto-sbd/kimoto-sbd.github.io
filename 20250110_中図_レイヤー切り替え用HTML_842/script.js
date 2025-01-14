const preview = document.getElementById('img-view');
const checkboxContainer = document.querySelector('.checkbox-container');
const txt = document.getElementById("txt");
const slider = document.getElementById("slider");
const labBox = document.querySelector('.lab-box');
const toggleLabBoxCheckbox = document.getElementById('toggle-lab-box');
const toggleModeButton = document.getElementById('toogle-mode');

function updateImagesHeight(value) {
    const imgs = document.querySelectorAll('#img-view img');
    imgs.forEach((img) => {
        img.style.height = value + "vh";
    });
}

txt.addEventListener("input", function (e) {
    const value = parseInt(e.target.value);
    if (value >= 100 && value <= 1000) {
        slider.value = value;
        updateImagesHeight(value);
    }
});

slider.addEventListener("input", function (e) {
    const value = parseInt(e.target.value);
    txt.value = value;
    updateImagesHeight(value);
});

function previewFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const img = document.createElement("img");
            img.src = imageUrl;

            if (file.name.includes('999')) {
                img.style.opacity = 0.3;
                img.dataset.opacity = 0.3;
            }

            preview.appendChild(img);
            resolve();
        };
        reader.onerror = function (e) {
            reject(e);
        };
        reader.readAsDataURL(file);
    });
}

document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        const resetValue = 100;
        slider.value = resetValue;
        txt.value = resetValue;
        updateImagesHeight(resetValue);
    }
});

const fileInput = document.getElementById('display');

fileInput.addEventListener('change', async () => {

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('ファイルを選んでください');
        return;
    }

    txt.value = '100';
    slider.value = '100';

    preview.innerHTML = '';
    checkboxContainer.innerHTML = '';

    let files = Array.from(fileInput.files).sort((a, b) => a.name.localeCompare(b.name));

    const files_999 = files.filter(file => file.name.includes('999'));
    const normalfiles = files.filter(file => !file.name.includes('999'));

    try {
        for (let i = 0; i < files_999.length; i++) {
            await previewFile(files_999[i]);
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'lab-pocket';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'lab-check';
            checkbox.id = 'inp' + (i + 1);
            checkbox.checked = true;
            const label = document.createElement('label');
            label.className = 'lab';
            label.setAttribute = (i + 1);
            label.innerText = files_999[i].name;
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            checkboxContainer.appendChild(checkboxDiv);
        }
        for (let i = 0; i < normalfiles.length; i++) {
            await previewFile(normalfiles[i]);
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'lab-pocket';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'lab-check';
            checkbox.id = 'inp' + (i + 1);
            checkbox.checked = true;
            const label = document.createElement('label');
            label.className = 'lab';
            label.setAttribute = (files_999.length + i + 1);
            label.innerText = normalfiles[i].name;
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            checkboxContainer.appendChild(checkboxDiv);
        }
        labBox.style.display = 'block';
        toggleLabBoxCheckbox.checked = true;
        checkScrollbar();
    } catch (error) {
        console.error('An error occurred while previewing files:', error);
        alert('ファイルのプレビュー中にエラーが発生');
    }
});

let isDragging = false;
let dragState = null;

checkboxContainer.addEventListener('mousedown', (event) => {
    if (event.target && event.target.classList.contains('lab-check')) {
        isDragging = true;
        dragState = event.target.checked;
        event.preventDefault();
    }
});

checkboxContainer.addEventListener('mouseup', () => {
    isDragging = false;
});

checkboxContainer.addEventListener('mousemove', (event) => {
    if (isDragging && event.target && event.target.classList.contains('lab-check')) {
        event.target.checked = !dragState;
        const index = Array.from(checkboxContainer.querySelectorAll('.lab-check')).indexOf(event.target);
        const imgs = document.querySelectorAll('#img-view img');
        if (event.target.checked) {
            imgs[index].style.display = 'block';
        } else {
            imgs[index].style.display = 'none';
        }
    }
});

checkboxContainer.addEventListener('change', (event) => {
    const target = event.target;
    if (target && target.classList.contains('lab-check')) {
        const index = Array.from(checkboxContainer.querySelectorAll('.lab-check')).indexOf(target);
        const imgs = document.querySelectorAll('#img-view img');
        imgs[index].style.display = target.checked ? 'block' : 'none';
    }
});

function updateCheckboxStatus() {
    const imgs = document.querySelectorAll('#img-view img');
    const checkboxes = document.querySelectorAll('.lab-check');
    imgs.forEach((img, index) => {
        checkboxes[index].checked = img.style.display !== 'none';
    });
}

const showAll = document.getElementById('all-button');
let isHidden = false;

showAll.addEventListener('click', () => {
    const imgs = document.querySelectorAll('#img-view img');
    imgs.forEach((img) => {
        if (isHidden) {
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    });
    isHidden = !isHidden;
    updateCheckboxStatus();
});

function checkScrollbar() {
    const labBox = document.querySelector('.lab-box');
    if (checkboxContainer.scrollHeight > checkboxContainer.clientHeight) {
        labBox.classList.add('with-scrollbar');
    } else {
        labBox.classList.remove('with-scrollbar');
    }
}
checkScrollbar();

window.addEventListener('resize', checkScrollbar);

toggleLabBoxCheckbox.addEventListener('change', function () {
    if (this.checked) {
        labBox.style.display = 'block';
    } else {
        labBox.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const opacityChangeButton = document.getElementById('opacitychange');
    const closeButton = document.getElementById('close-modal');
    const opacityText = document.getElementById('opacity-text');
    const opacityDoneButton = document.getElementById('opacity-done');

    opacityChangeButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    opacityDoneButton.addEventListener('click', () => {
        const opacityValue = parseFloat(opacityText.value);

        if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
            alert("透明度は半角数字の０から１の間で入力してください。");
            return;
        }

        const images = document.querySelectorAll('#img-view img');
        images.forEach((img) => {
            if (img.src.includes('999')) {
                img.style.opacity = opacityValue;
                img.dataset.opacity = opacityValue;
            }
        });

        modal.style.display = 'none';
    });
});

const toggleUIChange = document.getElementById('toggle-ui-change');
const uiElement = document.querySelector('.ui');

toggleUIChange.addEventListener('change', () => {
    if (toggleUIChange.checked) {
        uiElement.style.display = 'block';
    } else {
        uiElement.style.display = 'none';
    }
});