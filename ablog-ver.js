// 課題
// -ローカルストレージにすでにいろいろ入っていて動作しない。
// -ストレージのkeyをbookmarkにして、valueにデータを入れる。
// -同じ画面上にブックマークリストがある前提だからストアする場所を変える。
// -初めに全部のデータを取らずに、KEYがBookmarkだけを取る
// -displayは一番最後、とりあえず、データを入れる。

document.addEventListener("DOMContentLoaded", () => {
  // Set datatag according to file name
  const bookmarkBtn = document.querySelector("#btn")
  let bookmarkTitle
  let dataTag
  if (bookmarkBtn) {
    dataTag = bookmarkBtn.dataset.tag
    if (bookmarkBtn) {
      bookmarkTitle = dataTag
    }
  }

  let originalBookmark = localStorage.getItem("bookmark")
  originalBookmark = JSON.parse(originalBookmark)
  const bookmarkList = document.querySelector("#bookmark-list")

  const reorderStorage = () => {
    let newArray = []
    Array.from(bookmarkList.children).map(list => {
      if (list.classList.contains("active")) {
        const listData = list.querySelector(".handleBtn")
        const newObj = {
          title: listData.dataset.title,
          url: listData.dataset.href
        }

        newArray.push(newObj)
      }
    })

    // let storageData = localStorage.getItem("bookmark")
    // storageData = JSON.parse(storageData)
    localStorage.removeItem("bookmark")
    localStorage.setItem("bookmark", JSON.stringify(newArray))
  }

  // Drag and drop

  function getLI(target) {
    while (target.nodeName.toLowerCase() != "li") {
      target = target.parentNode
    }

    return target
  }

  let dragSrcEl = null

  const dragStart = e => {
    e.target.style.opacity = "0.4"

    const target = getLI(e.target)
    dragSrcEl = target

    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("html", target)
  }

  const dragEnd = e => {
    e.target.style.opacity = "1"
  }

  const dragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const onDrop = e => {
    e.stopPropagation()

    const target = getLI(e.target)

    if (target == target.parentElement.lastChild) {
      target.parentNode.insertBefore(dragSrcEl, target.nextSibling)
    } else {
      target.parentNode.insertBefore(dragSrcEl, target)
    }

    reorderStorage()
  }

  const activateDragDrop = () => {
    if (bookmarkList) {
      let items = document.querySelectorAll(".booklist")

      items.forEach(item => {
        if (item.classList.contains("active")) {
          item.addEventListener("dragstart", dragStart, false)
          item.addEventListener("dragend", dragEnd, false)
          item.addEventListener("dragover", dragOver, false)
          item.addEventListener("drop", onDrop, false)
        }
      })

      // items.forEach(function (item) {

      //   item.addEventListener("dragstart", dragStart, false)
      //   item.addEventListener("dragend", dragEnd, false)
      //   item.addEventListener("dragover", dragOver, false)
      //   item.addEventListener("drop", onDrop, false)
      // })
    }
  }

  // Fetch data from the local storage and
  // make each attr in the actual page
  const fetchDataFromLocalStorage = () => {
    let storageData = localStorage.getItem("bookmark")
    storageData = JSON.parse(storageData)

    if (storageData) {
      if (bookmarkList) {
        originalBookmark.map(item => {
          let newList = document.createElement("li")
          newList.setAttribute("class", "booklist active")
          newList.setAttribute("data-url", item.url)
          newList.setAttribute("draggable", "true")

          // newList.setAttribute("ondragstart", dragStart)
          // newList.setAttribute("ondragover", dragOver)
          // newList.setAttribute("ondrop", onDrag)

          let newSpan = document.createElement("span")
          newSpan.setAttribute("data-href", item.url)
          newSpan.setAttribute("data-title", item.title)
          newSpan.setAttribute("class", "handleBtn active")
          newSpan.textContent = "★"
          newList.appendChild(newSpan)
          const attr = document.createElement("a")

          attr.href = item.url
          attr.textContent = item.title

          newList.appendChild(attr)

          bookmarkList.appendChild(newList)
        })
      }
    }
  }

  // Check if there's an existing url in the local storage
  // if there's is remove bookmark class from btn
  const removeClassList = () => {
    const bookmarkBtn = document.querySelector("#btn")
    const currentUrl = window.location.href
    if (originalBookmark && bookmarkBtn) {
      originalBookmark.map(item => {
        const exsitingUrl = item.url
        if (exsitingUrl === currentUrl) {
          bookmarkBtn.classList.remove("bookmark-btn")
          bookmarkBtn.classList.add("delete")
        }
      })
    }
  }

  const removeItemFromBookMark = () => {
    const currentUrl = window.location.href
    if (bookmarkList) {
      Array.from(bookmarkList.children).map(ele => {
        if (ele.dataset.url == currentUrl) {
          ele.parentElement.removeChild(ele)
        }
      })
    }
  }

  // When delete btn is pressed,
  const removeDataFromLocalStrorage = e => {
    const tagDeleted = e.target.dataset.tag

    // remove item from localStorge "bookmark"
    let bookmarkStorage = localStorage.getItem("bookmark")
    bookmarkStorage = JSON.parse(bookmarkStorage)

    bookmarkStorage = bookmarkStorage.filter(item => item.title !== tagDeleted)

    localStorage.setItem("bookmark", JSON.stringify(bookmarkStorage))

    // removeItemFromBookMark(e)
    if (bookmarkBtn) {
      bookmarkBtn.classList.remove("delete")
      bookmarkBtn.classList.add("bookmark-btn")
    }
  }

  const removeByBtn = url => {
    let prevStorage = localStorage.getItem("bookmark")
    prevStorage = JSON.parse(prevStorage)

    prevStorage = prevStorage.filter(item => item.url !== url)

    localStorage.setItem("bookmark", JSON.stringify(prevStorage))
  }

  const setByBtn = (url, title) => {
    // Set item in the storage
    const newObjectAdded = [
      {
        title,
        url
      }
    ]

    let bookmarkStorage = localStorage.getItem("bookmark")
    bookmarkStorage = JSON.parse(bookmarkStorage)
    if (bookmarkStorage) {
      localStorage.setItem("bookmark", JSON.stringify(bookmarkStorage.concat(newObjectAdded)))
    } else {
      localStorage.setItem("bookmark", JSON.stringify(newObjectAdded))
    }
  }

  const activateBtn = () => {
    // Handle Bookmark btn
    let switchBtns = document.querySelectorAll(".handleBtn")

    if (switchBtns) {
      switchBtns.forEach(btn => {
        btn.addEventListener("click", e => {
          const targetUrl = e.target.dataset.href
          const targetTitle = e.target.dataset.title

          if (e.target.classList.contains("active")) {
            e.target.parentElement.classList.remove("active")
            e.target.parentElement.removeAttribute("draggable")
            e.target.parentElement.setAttribute("draggable", false)
            e.target.textContent = "☆"

            e.target.classList.remove("active")
            e.target.classList.add("inactive")

            // remove item from localStorge "bookmark"
            removeByBtn(targetUrl)
            activateDragDrop()
          } else if (e.target.classList.contains("inactive")) {
            e.target.parentElement.classList.add("active")
            e.target.parentElement.setAttribute("draggable", "true")
            e.target.textContent = "★"
            e.target.style.color = "rgb(241, 76, 76)"
            e.target.classList.remove("inactive")
            e.target.classList.add("active")

            setByBtn(targetUrl, targetTitle)
            activateDragDrop()
          }
        })
      })
    }
  }

  const reActivateBtn = list => {
    list.addEventListener("click", e => {
      console.log("bookmark btn clicked")
      const targetUrl = e.target.dataset.href
      const targetTitle = e.target.dataset.title

      if (e.target.classList.contains("active")) {
        console.log("remove btn clicked")
        e.target.parentElement.classList.remove("active")
        e.target.parentElement.removeAttribute("draggable")
        e.target.parentElement.setAttribute("draggable", false)
        e.target.textContent = "☆"

        e.target.classList.remove("active")
        e.target.classList.add("inactive")

        // remove item from localStorge "bookmark"
        removeByBtn(targetUrl)
        activateDragDrop()
      } else if (e.target.classList.contains("inactive")) {
        console.log("add btn clicked")
        e.target.parentElement.classList.add("active")
        e.target.parentElement.setAttribute("draggable", "true")
        e.target.textContent = "★"
        e.target.style.color = "rgb(241, 76, 76)"
        e.target.classList.remove("inactive")
        e.target.classList.add("active")

        setByBtn(targetUrl, targetTitle)
        activateDragDrop()
      }
    })
  }
  //ページのロード時にDOMのデータが消えてしまうため
  //ローカルストレージからデータを取ってきて
  //ブックマークリストの中にリストを作る
  //ついでにボタンのテキストを変える
  window.addEventListener("load", () => {
    fetchDataFromLocalStorage()

    // Handle Bookmark btn
    activateBtn()
    activateDragDrop()

    removeClassList()
    if (bookmarkBtn) {
      if (bookmarkBtn.className === "bookmark-btn") {
        bookmarkBtn.textContent = "ブックマークする"
      } else {
        bookmarkBtn.textContent = "ブックマーク済み"
      }
    }
  })

  // ブックマークをつける・外すを行う
  // クラス名で判断
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", e => {
      // If btn is bookmark-btn, add item to bookmark
      if (bookmarkBtn.className === "bookmark-btn") {
        // const tag = e.target.dataset.tag

        // Set item in the storage
        const newObjectAdded = [
          {
            title: bookmarkTitle,
            url: window.location.href
          }
        ]

        let bookmarkStorage = localStorage.getItem("bookmark")
        bookmarkStorage = JSON.parse(bookmarkStorage)
        if (bookmarkStorage) {
          localStorage.setItem("bookmark", JSON.stringify(bookmarkStorage.concat(newObjectAdded)))
        } else {
          localStorage.setItem("bookmark", JSON.stringify(newObjectAdded))
        }

        // Display on bookmark

        if (bookmarkList) {
          let newList = document.createElement("li")
          newList.setAttribute("data-url", window.location.href)
          newList.setAttribute("draggable", "true")
          newList.setAttribute("class", "booklist active")
          newList.addEventListener("ondragstart", () => {
            dragStart(e)
          })

          newList.addEventListener("ondragover", () => {
            dragOver(e)
          })

          newList.addEventListener("ondrop", () => {
            onDrop(e)
          })
          let newSpan = document.createElement("span")
          newSpan.setAttribute("data-href", window.location.href)
          newSpan.setAttribute("data-title", bookmarkTitle)
          newSpan.setAttribute("class", "active handleBtn")
          newSpan.textContent = "★"

          newList.appendChild(newSpan)
          const attr = document.createElement("a")
          attr.href = window.location.href
          attr.textContent = bookmarkTitle
          newList.appendChild(attr)

          bookmarkList.appendChild(newList)

          reActivateBtn(newList)
        }

        // 2) change class
        bookmarkBtn.classList.remove("bookmark-btn")
        bookmarkBtn.classList.add("delete")

        bookmarkBtn.textContent = "ブックマーク済み"

        activateDragDrop()
      } else if (bookmarkBtn.className === "delete") {
        removeDataFromLocalStrorage(e)
        removeItemFromBookMark()
        bookmarkBtn.textContent = "ブックマークする"
      }
    })
  }
})
