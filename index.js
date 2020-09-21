//Section 1 -- Double Linked List

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.length = 0;
    this.head = null;
    this.tail = null;
  }

  push(v) {
    const node = new Node(v);
    if (!this.length) {
      this.head = node;
      this.tail = node;
      this.length++;
      return this;
    }
    this.length++;
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
    this.tail.next = this.head;
    this.head.prev = this.tail;
    return this;
  }

  arrayConvertor(a) {
    for (let v of a) {
      this.push(v);
    }
    return this.arrayPointers(this.head);
  }

  arrayPointers(head) {
    const a = [];
    let current = head;
    for (let i = 0; i < this.length; i++) {
      a.push(current);
      current = current.next;
    }
    return a;
  }
}

// Section 2 -- State

const numToLink = [
  "https://daily-astronomy.herokuapp.com/",
  "https://daily-astronomy.herokuapp.com/",
  "https://skillsync.herokuapp.com/",
  "https://skillsync.herokuapp.com/",
  "https://skillsync.herokuapp.com/",
  "https://github.com/Holius/USA__Game",
  "https://github.com/Holius/USA__Game",
];

const state = {
  status: "home",
  gallery: [
    "img/gallery-top-0.jpg",
    "img/gallery-top-1.jpg",
    "img/gallery-top-2.jpg",
    "img/gallery-top-3.jpg",
    "img/gallery-top-4.jpg",
    "img/gallery-top-5.jpg",
    "img/gallery-top-6.jpg",
  ],
  galleryNodes: undefined,
  direction: "",
  order: undefined,
  listNodes: undefined,
  animationSheet: undefined,
  styleSheet: undefined,
  gallerySettings: {
    mobile: {
      gridSizes: [0, 100, 0],
      pictureWidths: [30, 60, 30],
      pictureHeights: [5, 40, 5],
      duration: 600,
    },
    tablet: {
      gridSizes: [0, 32.5, 35, 32.5, 0],
      pictureWidths: [8, 16, 35, 16, 8],
      pictureHeights: [7.5, 15, 30, 15, 7.5],
      duration: 600,
    },
    desktop: {
      gridSizes: [0, 16.25, 16.25, 35, 16.25, 16.25, 0],
      pictureWidths: [5, 10, 12.25, 35, 12.25, 10, 5],
      pictureHeights: [7.5, 10.5, 15, 35, 15, 10.5, 7.5],
      duration: 600,
    },
  },
  mode: undefined,
};

const createGalleryItem = (parent, classCSS, type) => {
  const elm = document.createElement(type);
  elm.classList.add(classCSS);
  parent.appendChild(elm);
  return elm;
};

const createGalleryColumnTemplate = (sizes) => {
  let str = "";
  for (let i = 1; i < sizes.length - 1; i++) {
    if (i === 1) {
      str += `${sizes[i]}vw `;
    } else {
      str += ` ${sizes[i]}vw`;
    }
  }
  return str;
};
const constructGallery = (parent, settings) => {
  const galleryNodes = [];
  parent.style.gridTemplateColumns = createGalleryColumnTemplate(
    settings.gridSizes
  );

  for (let i = 0; i < settings.gridSizes.length; i++) {
    if (i === 0) {
      const elm = createGalleryItem(parent, "gallery--picture", "div");
      elm.style.left = `-${settings.pictureWidths[i]}vw`;
      elm.style.height = `${settings.pictureHeights[i]}vh`;
      elm.style.width = `${settings.pictureWidths[i]}vw`;
      elm.style.borderRadius = "8%";
      elm.classList.add("gallery--hidden");
      galleryNodes.push(elm);
    } else if (i === settings.gridSizes.length - 1) {
      const elm = createGalleryItem(parent, "gallery--picture", "div");
      elm.style.right = `-${settings.pictureWidths[i]}vw`;
      elm.style.height = `${settings.pictureHeights[i]}vh`;
      elm.style.width = `${settings.pictureWidths[i]}vw`;
      elm.style.borderRadius = "8%";
      elm.classList.add("gallery--hidden");
      galleryNodes.push(elm);
    } else {
      const elm = createGalleryItem(parent, "gallery--picture", "div");
      elm.style.height = `${settings.pictureHeights[i]}vh`;
      elm.style.width = `${settings.pictureWidths[i]}vw`;
      elm.style.borderRadius = "8%";
      elm.style.cursor = "pointer";
      elm.classList.add("gallery--visible");

      galleryNodes.push(elm);
    }
  }
  return galleryNodes;
};

const getGalleryOrder = (direction, gallery) => {
  const newOrder = [];
  const srcPointers = [];

  for (let i = 0; i < gallery.length; i++) {
    if (direction === "left") {
      newOrder.push(gallery[i].next);
    } else {
      newOrder.push(gallery[i].prev);
    }
    srcPointers.push(newOrder[i].val);
  }

  //consider refactoring this to not directly change state
  state.listNodes = newOrder;
  state.gallery = srcPointers;
};

const setGalleryOrder = (galleryNodes, gallery) => {
  for (let i = 0; i < galleryNodes.length; i++) {
    galleryNodes[i].style.backgroundImage = `url("${gallery[i]}")`;
  }
};

const dynamicAnimation = (name, styles) => {
  //hardcoded value
  state.animationSheet.sheet.insertRule(
    `@keyframes ${name} {${styles}}`,
    state.animationSheet.length
  );
};

const dynamicStyle = (selector, styles) => {
  //hardcoded value
  state.styleSheet.sheet.insertRule(
    `${selector} {${styles}}`,
    state.stylesheet.length
  );
};

const setGalleryAnimation = (direction) => {
  const gridSizes = state.gallerySettings[state.mode]["gridSizes"];
  const pictureWidths = state.gallerySettings[state.mode]["pictureWidths"];
  const pictureHeights = state.gallerySettings[state.mode]["pictureHeights"];
  const duration = state.gallerySettings[state.mode]["duration"];

  const galleryNodes = state.galleryNodes;
  state.direction = direction;

  if (direction === "left") {
    for (let i = galleryNodes.length - 1; i > 0; i--) {
      const gridSizeNext = i === 1 ? gridSizes[i] : gridSizes[i - 1];

      const name = String.fromCharCode(i + 65);
      const styles = `100% {
        height: ${pictureHeights[i - 1]}vh;
        width: ${pictureWidths[i - 1]}vw;
        transform: translateX(-${(gridSizes[i] + gridSizeNext) / 2}vw);
      }`;
      dynamicAnimation(name, styles);
      galleryNodes[i].style.animation = `${name} ${duration / 1000}s`;
    }
  } else {
    for (let i = 0; i < galleryNodes.length - 1; i++) {
      const gridSizeNext =
        i === galleryNodes.length - 2 ? gridSizes[i] : gridSizes[i + 1];

      const name = String.fromCharCode(i + 65);
      const styles = `100% {
          height: ${pictureHeights[i + 1]}vh;
          width: ${pictureWidths[i + 1]}vw;
          transform: translateX(${(gridSizes[i] + gridSizeNext) / 2}vw);
        }`;
      dynamicAnimation(name, styles);
      galleryNodes[i].style.animation = `${name} ${duration / 1000}s`;
    }
  }
};

const checkMobile = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    state.mode = "mobile";
    return true;
  }
};

const init = () => {
  if (window.innerWidth <= 600) state.mode = "mobile";
  else if (window.innerWidth <= 900) state.mode = "tablet";
  else {
    state.mode = "desktop";
  }
  checkMobile();

  const gallery = document.getElementsByClassName("gallery")[0];
  state.galleryNodes = constructGallery(
    gallery,
    state.gallerySettings[state.mode]
  );

  //construct gallery list
  const ddl = new DoublyLinkedList();
  state.listNodes = ddl.arrayConvertor(state.gallery);
  getGalleryOrder("left", state.listNodes);
  getGalleryOrder("right", state.listNodes);
  setGalleryOrder(state.galleryNodes, state.gallery);

  state.animationSheet = document.createElement("style");
  state.animationSheet.type = "text/css";
  document.head.appendChild(state.animationSheet);
  state.styleSheet = document.createElement("style");
  state.styleSheet.type = "text/css";
  document.head.appendChild(state.styleSheet);
  //animation end
  const node = document.body.getElementsByClassName("gallery--picture")[1];
  node.addEventListener("animationend", function () {
    getGalleryOrder(state.direction, state.listNodes);
    setGalleryOrder(state.galleryNodes, state.gallery);
    for (let i = 0; i < state.galleryNodes.length; i++) {
      state.galleryNodes[i].style.animation = "";
    }
    for (let i = state.animationSheet.sheet.cssRules.length - 1; i > -1; i--) {
      state.animationSheet.sheet.deleteRule(i);
    }
  });

  //event listeners
  const leftButton = document.getElementsByClassName("gallery--button-left")[0];
  leftButton.addEventListener(
    "click",
    setGalleryAnimation.bind(null, "left", state.galleryNodes)
  );

  const rightButton = document.getElementsByClassName(
    "gallery--button-right"
  )[0];
  rightButton.addEventListener(
    "click",
    setGalleryAnimation.bind(null, "right", state.galleryNodes)
  );
};

init();

const resizePage = () => {
  let newMode = "";
  if (window.innerWidth <= 610) newMode = "mobile";
  else if (window.innerWidth <= 900) newMode = "tablet";
  else {
    newMode = "desktop";
  }
  checkMobile();
  if (newMode === state.mode) return;
  state.mode = newMode;

  const gallery = document.getElementsByClassName("gallery--picture");
  const length = gallery.length;
  for (let i = length - 1; i > 0; i--) {
    gallery[i].remove();
  }
  state.galleryNodes = undefined;
  state.galleryNodes = constructGallery(
    document.getElementsByClassName("gallery")[0],
    state.gallerySettings[newMode]
  );
  setGalleryOrder(state.galleryNodes, state.gallery);

  const node = document.body.getElementsByClassName("gallery--visible")[0];
  node.addEventListener("animationend", function () {
    getGalleryOrder(state.direction, state.listNodes);
    setGalleryOrder(state.galleryNodes, state.gallery);
    for (let i = 0; i < state.galleryNodes.length; i++) {
      state.galleryNodes[i].style.animation = "";
    }
    for (let i = state.animationSheet.sheet.cssRules.length - 1; i > -1; i--) {
      state.animationSheet.sheet.deleteRule(i);
    }
  });
};

window.onresize = resizePage;
