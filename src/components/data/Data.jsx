export const navList = [
  {
    id: 1,
    path: "/",
    text: "Home",
  },
  {
    id: 2,
    path: "/about",
    text: "About",
  },
  {
    id: 3,
    path: "/services",
    text: "Services",
  },
  {
    id: 4,
    path: "/rooms",
    text: "Extend stay",
  },
  {
    id: 5,
    path: "/page",
    text: "Explore",
    subItems: [
      {
        id: 51,
        path: "/booking",
        text: "Booking",
      },
      {
        id: 52,
        path: "/team",
        text: "Our Team",
      },
      {
        id: 53,
        path: "/testimonial",
        text: "Testimonial",
      },
    ],
  },
  {
    id: 6,
    path: "/contact",
    text: "Contact",
  },
];
export const socialIcons = [
  {
    icon: <i className="fab fa-facebook-f"></i>,
  },
  {
    icon: <i className="fab fa-twitter"></i>,
  },
  {
    icon: <i className="fab fa-instagram"></i>,
  },
  {
    icon: <i className="fab fa-linkedin-in"></i>,
  },
  {
    icon: <i className="fab fa-youtube"></i>,
  },
];

export const carouselData = [
  {
    img: "../assets/img/carousel-1.jpg",
    title: "Hotel Guest Assistant",
    subtitle: "Discover Diverse Range Of Concierge Services",
    btn1: "Request Services and amenities",
    btn2: "Download App",
  },
  {
    img: "../assets/img/carousel-2.jpg",
    title: "Your Ease and Convenience",
    subtitle: "Make Your Request, Bookings, Orders And Reservations with Ease",
    btn1: "Contact Front Desk",
    btn2: "Download App",
  },
];
export const about = [
  {
    icon: <i class="fa fa-hotel fa-2x text-primary mb-2"></i>,
    text: "Hotels",
    count: "7265",
  },
  {
    icon: <i class="fa fa-users fa-2x text-primary mb-2"></i>,
    text: "Staffs",
    count: "44434",
  },
  {
    icon: <i class="fa fa-users-cog fa-2x text-primary mb-2"></i>,
    text: "Guests",
    count: "89330",
  },
];

export const services = [
  {
    icon: <i class="fa fa-broom fa-2x text-primary"></i>,
    name: "House Keeping",
    discription: "Request room cleaning, Fresh Linens, or other housekeeping services with ease.",
  },
  {
    icon: <i class="fa fa-utensils fa-2x text-primary"></i>,
    name: "Meal Order",
    discription: "Craving for a snack or meal? Simply place an order. We'll do the rest.",
  },
  {
    icon: <i class="fa fa-spa fa-2x text-primary"></i>,
    name: "Spa & Fitness",
    discription: "Book a spa appointment or gym fitness trainer to get refreshed.",
  },

  {
    icon: <i class="fa fa-hotel fa-2x text-primary"></i>,
    name: "Book Another Stay",
    discription: "Enjoy your experience? Book your next stay effortlessly or extend your stay.",
  },
  {
    icon: <i class="fa fa-map-marker-alt fa-2x text-primary"></i>,
    name: "Book a tour",
    discription: "Discover the best local attractions and events curated just for you.",
  },

  {
    icon: <i class="fa fa-shopping-cart fa-2x text-primary"></i>,
    name: "Shop In-hotel",
    discription: "Browse and purchase a variety of items directly from our in-hotel store. From toiletries and snacks to souvenirs and gifts, we've got you covered.",
  },
  {
    icon: <i class="fa fa-taxi fa-2x text-primary"></i>,
    name: "Taxi and Car Rental",
    discription: "Arrange a taxi or other rentals vehicle at any time of the day.",
},
{
  icon: <i class="fa fa-bell fa-2x text-primary"></i>,
  name: "Contact Front Desk",
  discription: "Reach the front desk for other needed assistance.",
},
{
  icon: <i class="fa fa-sign-in-alt fa-2x text-primary"></i>,
  name: "Check-In And Check-Out",
  discription: "Skip the lines, and handle your check-in and check-out directly from your phone.",
},
];
export const team = [
  {
    image: "../assets/img/team-1.jpg",
    name: "Marvix Santos",
    designation: "Advisory",
  },
  {
    image: "../assets/img/team-2.jpg",
    name: "Ihok Antovoc",
    designation: "Deputy Advisory",
  },
  {
    image: "../assets/img/team-3.jpg",
    name: "Ben Manuel",
    designation: "IT Specialist",
  },
  {
    image: "../assets/img/team-4.jpg",
    name: "Rosa Gold",
    designation: "Designation",
  },
];

export const footerItem = [
  {
    id: 1,
    header: "Company",
    UnitItem: [
      {
        name: "About Us",
      },
      {
        name: "Contact Us",
      },
      {
        name: "Privacy Policy",
      },
      {
        name: "Terms & Condition",
      },
      {
        name: "Support",
      },
    ],
  },
  {
    id: 2,
    header: "Services",
    UnitItem: [
      {
        name: "Food & Restaurant",
      },
      {
        name: "Spa & Fitness",
      },
      {
        name: "Transport Assist",
      },
      {
        name: "Tour and Attractions",
      },
      {
        name: "HouseKeeping",
      },
    ],
  },
];

export const footerContact = [
  {
    icon: <i className="fa fa-map-marker-alt me-3"></i>,
    name: "12 HomeLand Drive, Portlaoise, Ireland",
  },
  {
    icon: <i className="fa fa-phone-alt me-3"></i>,
    name: "+353-81-234-56",
  },
  {
    icon: <i className="fa fa-envelope me-3"></i>,
    name: "info@guestease.com",
  },
];

export const contact = [
  {
    icon: <i class="fa fa-envelope-open text-primary me-2"></i>,
    title: "Booking",
    email: "book@guestease.com",
  },
  {
    icon: <i class="fa fa-envelope-open text-primary me-2"></i>,
    title: "Technical",
    email: "tech@guestease.com",
  },
  {
    icon: <i class="fa fa-envelope-open text-primary me-2"></i>,
    title: "General",
    email: "info@guestease.com",
  },
];
export const testimonial = [
  {
    description:
      "Very nice and user-friendly app",
    name: "Singer Crown",
    profession: "Businessman",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-1.jpg",
  },
  {
    description:
      "Amazing quick app",
    name: "Anonynmous",
    profession: "Anonymous",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-2.jpg",
  },
  {
    description:
      "Very reliable. I highly recommend.",
    name: "Daisy Dusk",
    profession: "Profession",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-3.jpg",
  },
];

export const roomItems = [
  {
    img: "../assets/img/bedroom4.png",
    price: "$120/night",
    name: "Junior Suit",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description:
      "Very comfortable for a single individual.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },

  {
    img: "../assets/img/bedroom5.png",
    price: "$150/night",
    name: "Executive Suite",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description:
      "Highly recommended for a small family.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    img: "../assets/img/bedroom6.png",
    price: "$250/night",
    name: "Super Deluxe",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description:
      "Luxury and High class.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
];

export const facility = [
  {
    icon: <i class="fa fa-bed text-primary me-2"></i>,
    quantity: 3,
    facility: "bed",
  },
  {
    icon: <i class="fa fa-bath text-primary me-2"></i>,
    quantity: 2,
    facility: "bath",
  },
  {
    icon: <i class="fa fa-wifi text-primary me-2"></i>,
    facility: "Wifi",
  },
];
