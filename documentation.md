
# PROJECT NAME

---

Name: Zicong (Jimmy) Bai

Date: April 10th, 2020

Project Topic: List of ongoing discounts and freebies from restaurants around College Park

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Post date         `Type: String`
- `Field 2`: Start date        `Type: String`
- `Field 3`: End date          `Type: String`
- `Field 4`: Type              `Type: String`
- `Field 5`: Location          `Type: String`
- `Field 6`: Description       `Type: String`
- `Field 7`: Views             `Type: Number`
- `Field 8`: UUID              `Type: Number`

Schema: 
```javascript
{
  post_date: String,
  start_date: String,
  end_date: String,
  type: String,
  location: String,
  description: String,
  views: Number,
  uuid: Number
}
```

### 2. Add New Data

HTML form route: `None. Form is a modal persistant on all pages`

POST endpoint route: `/add`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/add',
    headers: { 
      'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
      post_date: '2020-03-29T18:25:43.176Z',
      start_date: 'Mar 10th, 2020',
      end_date: 'Mar 11th, 2020',
      type: 'Discount',
      location: 'Aroy Thai Restaurant',
      description: '25% off with you eat your entire meal in 30 minutes.',
      views: 0,
      uuid: 123456789
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/`

### 4. Search Data

Search Field: `Location`

### 5. Navigation Pages

Navigation Filters
1. Hot -> `  /filter/hot  `
2. Ending Soon -> `  /filter/ending_soon  `
3. Discounts -> `  /filter/discount  `
4. Freebies -> `  /filter/free  `
5. New -> `  /  `

