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
    img: `${process.env.PUBLIC_URL}/assets/img/carousel-1.jpg`,
    title: "Hotel Guest Assistant",
    subtitle: "Discover Diverse Range Of Concierge Services",
    btn1: "Request Services and amenities",
    btn2: "Download App",
  },
  {
    img: `${process.env.PUBLIC_URL}/assets/img/carousel-2.jpg`,
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
    icon: <i className="fa fa-bed"></i>,
    name: "Housekeeping Services",
    description: "Request housekeeping assistance for your room.",
    link: "/housekeeping",
  },
  {
    icon: <i className="fa fa-spa"></i>,
    name: "Spa & Fitness",
    description: "Book a relaxing spa session or fitness class.",
    link: "/spa-fitness",
  },
  {
    icon: <i className="fa fa-utensils"></i>,
    name: "Meal Order",
    description: "Place an order for in-room dining.",
    link: "/meal-order",
  },
  {
    icon: <i className="fa fa-phone"></i>,
    name: "Contact Front Desk",
    description: "Get in touch with our front desk for assistance.",
    link: "/contact-front-desk",
  },
  {
    icon: <i className="fa fa-calendar"></i>,
    name: "Book Another Stay",
    description: "Plan your next stay with us.",
    link: "/book-another-stay",
  },
  {
    icon: <i className="fa fa-car"></i>,
    name: "Book Taxi",
    description: "Book a taxi or car rental service.",
    link: "/book-taxi",
  },
  {
    icon: <i className="fa fa-map"></i>,
    name: "Book Tour & Attractions",
    description: "Explore nearby attractions with guided tours.",
    link: "/book-tour",
  },
  {
    icon: <i className="fa fa-shopping-cart"></i>,
    name: "Shop in Hotel",
    description: "Order items from our in-hotel shop.",
    link: "/shop-in-hotel",
  },
{
  icon: <i class="fa fa-sign-in-alt fa-2x text-primary"></i>,
  name: "Check-In And Check-Out",
  discription: "Skip the lines, and handle your check-in and check-out directly from your phone.",
},
];
export const team = [
  {
    image: `${process.env.PUBLIC_URL}/assets/img/team-1.jpg`,
    name: "Marvix Santos",
    designation: "Advisory",
  },
  {
    image: `${process.env.PUBLIC_URL}/assets/img/team-2.jpg`,
    name: "Ihok Antovoc",
    designation: "Deputy Advisory",
  },
  {
    image: `${process.env.PUBLIC_URL}/assets/img/team-3.jpg`,
    name: "Ben Manuel",
    designation: "IT Specialist",
  },
  {
    image: `${process.env.PUBLIC_URL}/assets/img/team-4.jpg`,
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
    description: "Very nice and user-friendly app",
    name: "Singer Crown",
    profession: "Businessman",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: `${process.env.PUBLIC_URL}/assets/img/testimonial-1.jpg`,
  },
  {
    description: "Amazing quick app",
    name: "Anonynmous",
    profession: "Anonymous",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: `${process.env.PUBLIC_URL}/assets/img/testimonial-2.jpg`,
  },
  {
    description: "Very reliable. I highly recommend.",
    name: "Daisy Dusk",
    profession: "Profession",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: `${process.env.PUBLIC_URL}/assets/img/testimonial-3.jpg`,
  },
];

export const roomItems = [
  {
    img: `${process.env.PUBLIC_URL}/assets/img/bedroom4.png`,
    price: "$120/night",
    name: "Junior Suit",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description: "Very comfortable for a single individual.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    img: `${process.env.PUBLIC_URL}/assets/img/bedroom5.png`,
    price: "$150/night",
    name: "Executive Suite",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description: "Highly recommended for a small family.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    img: `${process.env.PUBLIC_URL}/assets/img/bedroom6.png`,
    price: "$250/night",
    name: "Super Deluxe",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    description: "Luxury and High class.",
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
