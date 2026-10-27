const key = document.getElementById("key");
const crowBar = document.getElementById("crowBar");
const sceneImage = document.getElementById("sceneImage");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const finalCrowBarArea = document.getElementById("finalCrowBarArea");
const lockedBoxArea = document.getElementById("lockedBoxArea");
const lockedBoxKeyArea = document.getElementById("lockedBoxKeyArea");
const slot = document.getElementById("slot");
const slot1 = document.getElementById("slot1");
const inventoryKey = document.getElementById("inventoryKey");
const finalCloseBtn= document.getElementById("finalCloseBtn");

// Show game when background loads
if (sceneImage.complete) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('gameScreen').style.opacity = '1';
} else {
  sceneImage.onload = () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('gameScreen').style.opacity = '1';
  };
}




let key1Collected = false
let crowbarCollected = false
let key1CollectedFirst = false
let crowbarCollectedFirst = false
let finalKeyCollected = false
let finalCrowAreaOpened = false
let lockBoxAreaOpened = false


key.addEventListener("click", () => {
    key1Collected = true;
    collectKey();
  });

crowBar.addEventListener("click", () => {
    crowbarCollected = true;
    collectKey();
  });

closeBtn.addEventListener("click", closeOverlayOnce);

function closeOverlayOnce() {
  finalCrowBarArea.classList.add("disabled")
  sceneImage.classList.remove("blur");
  overlay.classList.add("hidden");
  closeBtn.classList.add("hidden");
  lockedBoxArea.classList.add("disabled");
  lockedBoxKeyArea.classList.add("disabled");
}

function nextImage() {
    finalCrowBarArea.classList.remove("disabled")
    sceneImage.classList.add("blur");
    overlay.classList.remove("hidden");
    closeBtn.classList.remove("hidden");
    if(finalCrowAreaOpened == true)
    {
      lockedBoxArea.classList.remove("disabled");
    }
    if(lockBoxAreaOpened == true)
    {
      lockedBoxKeyArea.classList.remove("disabled");
    }
  }

function collectKey() {
  if (key1Collected===true && crowbarCollected===false){
    const inventoryKey = document.createElement("img");
    inventoryKey.src = "../../assets/room7/key.webp";
    inventoryKey.style.width = "30px";
    inventoryKey.draggable = true;
    slot.appendChild(inventoryKey);
    sceneImage.src = "../../assets/room7/bg_3.webp";
    key.style.display = "none";
    key1CollectedFirst = true
    slot.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "key");
    });
  }

  if (key1Collected===false && crowbarCollected===true){
    const inventoryKey = document.createElement("img");
    inventoryKey.src = "../../assets/room7/crowbar.webp";
    inventoryKey.style.width = "30px";
    inventoryKey.draggable = true;
    slot.appendChild(inventoryKey);
    sceneImage.src = "../../assets/room7/bg_2.webp";
    // hide crowbar from scene
    crowBar.style.display = "none";
    crowbarCollectedFirst = true
    slot.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "crowbar");
    });
  }

  if (key1Collected===true && crowbarCollected===true){
    if(crowbarCollectedFirst===true){
      const inventoryKey1 = document.createElement("img");
      inventoryKey1.src = "../../assets/room7/key.webp";
      inventoryKey1.style.width = "30px";
      inventoryKey1.draggable = true;
      slot1.appendChild(inventoryKey1);
      sceneImage.src = "../../assets/room7/bg_4.webp";
      key.style.display = "none";
      finalCrowBarArea.classList.remove("disabled")
      slot1.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "key");
      });
    }
    if(key1CollectedFirst===true){
      const inventoryKey1 = document.createElement("img");
      inventoryKey1.src = "../../assets/room7/crowbar.webp";
      inventoryKey1.style.width = "30px";
      inventoryKey1.draggable = true;
      slot1.appendChild(inventoryKey1);
      sceneImage.src = "../../assets/room7/bg_4.webp";
      crowBar.style.display = "none";
      // finalCrowBarArea.classList.remove("disabled")
      slot1.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "crowbar");
      });
    }
  }
  }

finalCrowBarArea.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

finalCrowBarArea.addEventListener("drop", (e) => {
  finalCrowAreaOpened = true
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (item === "crowbar") {
      overlay.src = "../../assets/room7/wooden_box_open.webp";
      if(crowbarCollectedFirst===true){
        slot.style.display = "none";
      }
      if(key1CollectedFirst===true){
        slot1.style.display = "none";
      }
      finalCrowBarArea.classList.add("disabled")
      lockedBoxArea.classList.remove("disabled")
      sceneImage.src = "../../assets/room7/bg_5.webp";
    }            

  });

lockedBoxArea.addEventListener("click",() => {
    overlay.src = "../../assets/room7/locked_box.webp";   
    lockBoxAreaOpened = true
    lockedBoxArea.classList.add("disabled"); 
    lockedBoxKeyArea.classList.remove("disabled");     
  });

lockedBoxKeyArea.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

lockedBoxKeyArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (item === "key") {
      overlay.src = "../../assets/room7/locked_box_2.webp";
      if(crowbarCollectedFirst===true){
        slot1.style.display = "none";
      }
      if(key1CollectedFirst===true){
        slot.style.display = "none";
      }
      lockedBoxKeyArea.classList.add("disabled")
      finalKeyArea.classList.remove("disabled")
    }            

  });

finalKeyArea.addEventListener("click", () => {
  finalKeyCollected = true;
  collectFinalKey();
  });

function collectFinalKey() {
  overlay.src = "../../assets/room7/locked_box_3.webp";
  slot.style.display = "block";
  slot.innerHTML = "";
  // const inventoryKey = document.getElementById("inventoryKey");
  // slot.removeChild(inventoryKey);
  const inventoryKey = document.createElement("img");
  inventoryKey.src = "../../assets/room7/key_to_open_the_door_for_room_1.webp";
  inventoryKey.style.width = "45px";
  inventoryKey.style.position = "absolute";
  // inventoryKey.style.bottom = "220px";  
  inventoryKey.draggable = true;
  slot.appendChild(inventoryKey);
  finalDoorArea.classList.remove("disabled")
  slot.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "finalKey");
  });
}

finalDoorArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

finalDoorArea.addEventListener("drop", (e) => {
  e.preventDefault();
  const item = e.dataTransfer.getData("text/plain");
  if (item === "finalKey") {
    sceneImage.src = "../../assets/room7/bg_6.webp";
    slot.style.display = "none";
    finalDoorArea.classList.add("disabled")
    setTimeout(() => {
      sceneImage.classList.add("blur");
      finalOverlay.classList.remove("hidden");
      finalCloseBtn.classList.remove("hidden");
      finalCloseBtn.classList.remove("hidden");
      lastoptions.style.display = 'flex';
      
      // Show ad in inventory position after final panel appears
      setTimeout(() => {
          const panelAd = document.querySelector('.panel-ad');
          panelAd.style.display = 'block';
          panelAd.style.bottom = '10px'; // Move ad lower to avoid button overlap
          panelAd.style.height = '200px'; // Reduce height to avoid overlap
          panelAd.style.zIndex = '999'; // Lower z-index than buttons
          (adsbygoogle = window.adsbygoogle || []).push({});
      }, 1000);
      
    }, 1200)
  }            

});


finalCloseBtn.addEventListener("click", () => {
  location.reload();
});

document.querySelector(".homebtn").addEventListener("click", () => {
  navigateWithLoader("../home_page/home.html");
});

document.querySelector(".nextbtn").addEventListener("click", () => {
  let unlockedLevel = parseInt(localStorage.getItem('unlockedLevel')) || 1;
  if (unlockedLevel < 8) {
    localStorage.setItem('unlockedLevel', 8);
  }
  navigateWithLoader("../level_page/levels1-10.html");
});