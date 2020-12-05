const Category = require("../models/category.model");
const CuisineStyle = require("../models/cuisineStyle.model");
const PriceRange = require("../models/priceRange.model");
const StoreTime = require("../models/storeTime.model");

const categoryData = [
  {
    categoryName: "Ethinic",
    categoryVal: "ethinic",
  },
  {
    categoryName: "Fast Food",
    categoryVal: "fastfood",
  },
  {
    categoryName: "Casual Dining",
    categoryVal: "casualdining",
  },
  {
    categoryName: "Premium Dining",
    categoryVal: "premiumdining",
  },
  {
    categoryName: "Family Dining",
    categoryVal: "familydining",
  },
  {
    categoryName: "Find Dining",
    categoryVal: "finedining",
  },
  {
    categoryName: "Choose Category",
    categoryVal: "",
  },
];
const cuisineStyleData = [
  {
    cuisineName: "American",
    cuisineVal: "american",
  },
  {
    cuisineNAme: "Italian",
    cuisineVal: "italian",
  },
  {
    cuisineNAme: "Steak House",
    cuisineVal: "steakhouse",
  },
  {
    cuisineNAme: "Seafood",
    cuisineVal: "seafood",
  },
  {
    cuisineNAme: "French",
    cuisineVal: "french",
  },
  {
    cuisineNAme: "Indian",
    cuisineVal: "indian",
  },
  {
    cuisineNAme: "Japanese",
    cuisineVal: "japanese",
  },
  {
    cuisineNAme: "British",
    cuisineVal: "british",
  },
  {
    cuisineNAme: "Barbecue",
    cuisineVal: "barbecue",
  },
  {
    cuisineNAme: "Tapas",
    cuisineVal: "tapas",
  },
  {
    cuisineNAme: "Grill",
    cuisineVal: "grill",
  },
  {
    cuisineNAme: "Comform Food",
    cuisineVal: "conformfood",
  },
  {
    cuisineNAme: "Afternoon Tea",
    cuisineVal: "afternoontea",
  },
  {
    cuisineNAme: "Burgers",
    cuisineVal: "burgers",
  },
  {
    cuisineNAme: "Canadian",
    cuisineVal: "canadian",
  },
  {
    cuisineNAme: "Vegan",
    cuisineVal: "vegan",
  },
  {
    cuisineNAme: "Vegetarian",
    cuisineVal: "vegiterian",
  },
  {
    cuisineNAme: "Asian",
    cuisineVal: "asian",
  },
  {
    cuisineNAme: "European",
    cuisineVal: "european",
  },
  {
    cuisineNAme: "Continental",
    cuisineVal: "continental",
  },
  {
    cuisineNAme: "Choose Style",
    cuisineVal: "",
  },
];
const priceRangeData = [
  {
    priceRangeName: "low",
    minPrice: 0,
    maxPrice: 50,
  },
  {
    priceRangeName: "medium",
    minPrice: 50,
    maxPrice: 100,
  },
  {
    priceRangeName: "high",
    minPrice: 100,
    maxPrice: 9999,
  },
  {
    priceRangeName: "",
    minPrice: 0,
    maxPrice: 0,
  },
];
const storeTimeData = [
  {
    storeTimeVal: "7am",
    storeTimeName: "7:00 AM",
  },
  {
    storeTimeVal: "730am",
    storeTimeName: "7:30 AM",
  },
  {
    storeTimeVal: "8am",
    storeTimeName: "8:00 AM",
  },
  {
    storeTimeVal: "830am",
    storeTimeName: "8:30 AM",
  },
  {
    storeTimeVal: "9am",
    storeTimeName: "9:00 AM",
  },
  {
    storeTimeVal: "930am",
    storeTimeName: "9:30 AM",
  },
  {
    storeTimeVal: "10am",
    storeTimeName: "10:00 AM",
  },
  {
    storeTimeVal: "1030am",
    storeTimeName: "10:30 AM",
  },
  {
    storeTimeVal: "11am",
    storeTimeName: "11:00 AM",
  },
  {
    storeTimeVal: "1130am",
    storeTimeName: "11:30 AM",
  },
  {
    storeTimeVal: "12pm",
    storeTimeName: "12:00 PM",
  },
  {
    storeTimeVal: "123pm",
    storeTimeName: "12:30 PM",
  },
  {
    storeTimeVal: "1pm",
    storeTimeName: "1:00 PM",
  },
  {
    storeTimeVal: "130pm",
    storeTimeName: "1:30 PM",
  },
  {
    storeTimeVal: "2pm",
    storeTimeName: "2:00 PM",
  },
  {
    storeTimeVal: "230pm",
    storeTimeName: "2:30 PM",
  },
  {
    storeTimeVal: "3pm",
    storeTimeName: "3:00 PM",
  },
  {
    storeTimeVal: "3pm",
    storeTimeName: "3:30 PM",
  },
  {
    storeTimeVal: "4pm",
    storeTimeName: "4:00 PM",
  },
  {
    storeTimeVal: "430pm",
    storeTimeName: "4:30 PM",
  },
  {
    storeTimeVal: "5pm",
    storeTimeName: "5:00 PM",
  },
  {
    storeTimeVal: "530pm",
    storeTimeName: "5:30 PM",
  },
  {
    storeTimeVal: "6pm",
    storeTimeName: "6:00 PM",
  },
  {
    storeTimeVal: "630pm",
    storeTimeName: "6:30 PM",
  },
  {
    storeTimeVal: "7pm",
    storeTimeName: "7:00 PM",
  },
  {
    storeTimeVal: "730pm",
    storeTimeName: "7:30 PM",
  },
  {
    storeTimeVal: "8pm",
    storeTimeName: "8:00 PM",
  },
  {
    storeTimeVal: "830pm",
    storeTimeName: "8:30 PM",
  },
  {
    storeTimeVal: "9pm",
    storeTimeName: "9:00 PM",
  },
  {
    storeTimeVal: "10pm",
    storeTimeName: "10:00 PM",
  },
  {
    storeTimeVal: "1030pm",
    storeTimeName: "10:30 PM",
  },
  {
    storeTimeVal: "11pm",
    storeTimeName: "11:00 PM",
  },
  {
    storeTimeVal: "1130pm",
    storeTimeName: "11:30 PM",
  },
  {
    storeTimeVal: "12am",
    storeTimeName: "12:00 AM",
  },
  {
    storeTimeVal: "1230am",
    storeTimeName: "12:30 AM",
  },
  {
    storeTimeVal: "1am",
    storeTimeName: "1:00 AM",
  },
  {
    storeTimeVal: "130am",
    storeTimeName: "1:30 AM",
  },
];

router.route("/initialData").get((req, res) => {
  const category = new Category(categoryData);
  const priceRange = new PriceRange(priceRangeData);
  const cuisineStyle = new CuisineStyle(cuisineStyleData);
  const storeTime = new StoreTime(storeTimeData);

  category.save();
  priceRange.save();
  cuisineStyle.save();
  storeTime.save();
});
