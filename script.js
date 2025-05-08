// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle")
  const navMenu = document.getElementById("nav-menu")

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    document.body.classList.toggle("no-scroll")
  })

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll("#nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      document.body.classList.remove("no-scroll")
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll("section")

  function setActiveLink() {
    const scrollPosition = window.scrollY

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  window.addEventListener("scroll", setActiveLink)

  // Menu Filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const menuItems = document.querySelectorAll(".menu-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      menuItems.forEach((item) => {
        if (filter === "all" || item.classList.contains(filter)) {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
      })
    })
  })

  // Testimonial Slider
  const testimonials = document.querySelectorAll(".testimonial")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.getElementById("prev-testimonial")
  const nextBtn = document.getElementById("next-testimonial")
  let currentIndex = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial) => testimonial.classList.remove("active"))
    dots.forEach((dot) => dot.classList.remove("active"))

    testimonials[index].classList.add("active")
    dots[index].classList.add("active")
    currentIndex = index
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
    showTestimonial(currentIndex)
  })

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length
    showTestimonial(currentIndex)
  })

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index)
    })
  })

  // Auto slide testimonials
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length
    showTestimonial(currentIndex)
  }, 5000)

  // Shopping Cart Functionality
  const addToCartBtns = document.querySelectorAll(".add-to-cart")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")
  const cartSidebar = document.getElementById("cart-sidebar")
  const cartOverlay = document.getElementById("cart-overlay")
  const closeCartBtn = document.getElementById("close-cart")

  const cart = []

  // Add to cart
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item")
      const title = menuItem.querySelector("h3").textContent
      const price = Number.parseFloat(menuItem.querySelector(".price").textContent.replace("$", ""))
      const imgSrc = menuItem.querySelector("img").src

      const existingItem = cart.find((item) => item.title === title)

      if (existingItem) {
        existingItem.quantity++
      } else {
        cart.push({
          title,
          price,
          imgSrc,
          quantity: 1,
        })
      }

      updateCart()
      openCart()
    })
  })

  // Update cart
  function updateCart() {
    cartItems.innerHTML = ""
    let totalPrice = 0

    cart.forEach((item, index) => {
      const cartItemEl = document.createElement("div")
      cartItemEl.classList.add("cart-item")

      cartItemEl.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.imgSrc}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                        <button class="cart-item-remove" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            `

      cartItems.appendChild(cartItemEl)
      totalPrice += item.price * item.quantity
    })

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`

    // Add event listeners to quantity buttons
    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        if (cart[index].quantity > 1) {
          cart[index].quantity--
        } else {
          cart.splice(index, 1)
        }
        updateCart()
      })
    })

    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart[index].quantity++
        updateCart()
      })
    })

    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart.splice(index, 1)
        updateCart()
      })
    })
  }

  // Open cart
  function openCart() {
    cartSidebar.classList.add("active")
    cartOverlay.classList.add("active")
  }

  // Close cart
  function closeCart() {
    cartSidebar.classList.remove("active")
    cartOverlay.classList.remove("active")
  }

  closeCartBtn.addEventListener("click", closeCart)
  cartOverlay.addEventListener("click", closeCart)

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("active")
    } else {
      backToTopBtn.classList.remove("active")
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Form submission
  const contactForm = document.getElementById("contact-form")
  const newsletterForm = document.getElementById("newsletter-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      alert("Thank you for your message! We will get back to you soon.")
      this.reset()
    })
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      alert("Thank you for subscribing to our newsletter!")
      this.reset()
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })
})
