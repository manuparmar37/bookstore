function generateFilePicker() {
    // Show files in file selectors
    const filePickers = document.querySelectorAll(".file-picker-wrapper");

    for (const picker of filePickers) {
    const input = picker.querySelector("input");

    const chosen = picker.querySelector(".file-picker-chosen");
    const cancel = picker.querySelector(".file-picker-cancel");

    const chosenRow = chosen.parentElement.parentElement;
    if(chosen.innerHTML == '') {
        chosenRow.classList.add("hidden");
    }

    input.addEventListener("change", () => {
        let fileNames = Array.from(input.files)
        .map((f) => f.name)
        .join(", ");
        chosen.innerHTML = fileNames;
        chosenRow.classList.remove("hidden");
    });

    cancel.addEventListener("click", () => {
        input.value = null;
        chosen.innerHTML = "";
        chosenRow.classList.add("hidden");
    });
    }

    // Single file picker
    const singleFilePickers = document.querySelectorAll(
    ".single-file-picker-wrapper"
    );

    for (const picker of singleFilePickers) {
    const chosen = picker.querySelector(".single-file-picker-name");
    const input = picker.querySelector("input");

    chosen.innerHTML = "Choose a file";

    input.addEventListener("change", () => {
        chosen.innerHTML = input.files[0] ? input.files[0].name : "Choose a file";
    });
    }
}

generateFilePicker();
// Timer
const timers = document.querySelectorAll(".resend-otp-link");
for (const link of timers) {
  const timer = link.querySelector(".timer");

  link.addEventListener("click", () => {
    timer.innerHTML = "00:10";
    link.classList.add("disabled");

    const handle = setInterval(() => {
      const current = Number(timer.innerHTML.substring(3));
      console.log(current);

      if (current == 0) {
        clearInterval(handle);
        timer.innerHTML = "";
        link.classList.remove("disabled");

        return;
      }

      let timeString = String(current - 1);
      if (timeString.length == 1) timeString = "0" + timeString;
      timer.innerHTML = `00:${timeString}`;
    }, 1000);
  });
}

// Image upload
const imageSelectWrappers = document.querySelectorAll(".image-select-wrapper");
for (const imageSelectWrapper of imageSelectWrappers) {
  const label = imageSelectWrapper.querySelector("label");
  const input = label.querySelector("input");
  const parent = imageSelectWrapper.querySelector(".image-preview-wrapper");

  const buildPreviews = () => {
    if (!input.files || input.files.length === 0) {
      parent.innerHTML = "";
      return;
    }

    parent.innerHTML = "";

    for (const file of input.files) {
      const div = document.createElement("div");
      div.classList.add("image-picker-icon-preview-wrapper");
      const img = document.createElement("img");
      img.file = file;
      img.classList.add("image-picker-icon-preview");

      img.onclick = () => {
        const dataTransfer = new DataTransfer();

        for (const file of input.files) {
          if (file.name !== img.file.name) {
            dataTransfer.items.add(file);
          }
        }

        input.files = dataTransfer.files;
        buildPreviews();
      };
      div.appendChild(img);
      parent.appendChild(div);

      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.readAsDataURL(file);
    }
  };

  input.addEventListener("change", () => buildPreviews());
}
