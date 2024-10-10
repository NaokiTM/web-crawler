import { React, useEffect, useState } from 'react';
import axios from 'axios';
import * as cheerio from "cheerio";

const ReturnPrices = () => {
    const [productNames, setProductNames] = useState([])
    const [productPrices, setProductPrices] = useState([])


    const crawl = async({ url }) => {
        try {
            const response = await axios.get(url)
            const $ = cheerio.load(response.data)

            const productNames = []
            const productPrices = []

            $("a.productBlock_link").each(async (index, element) => {

                const href = $(element).attr('href');
                const absoluteUrl = new URL(href, 'https://www.fragrancedirect.co.uk').href;


                if (href) {
                    try {
                        const productLinkResponse = await axios.get(absoluteUrl)
                        const productPage = cheerio.load(productLinkResponse.data)

                        const name = productPage("h1.productName_title").first().text().trim()
                        const price = productPage('p.productPrice_price').first().text().trim();

                        productNames.push(name)
                        productPrices.push(price)

                        productNames.forEach((name, index) => {
                            if (name === undefined) {
                                productNames.splice(index, 1);
                            }
                        });
                        
                        productPrices.forEach((price, index) => {
                            if (price === undefined) {
                                productPrices.splice(index, 1);
                            } 
                        });

                        console.log(productNames[index] + " - " + productPrices[index])


                    } catch (error) {
                        console.log("error fetching href from specified anchor tag")
                    }
                }





            });

            setProductNames(names);
            setProductPrices(prices);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const url = 'https://www.fragrancedirect.co.uk'; // Replace with your actual URL
        crawl({ url });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
          <h1>Product Prices</h1>
          <ul>
            {productNames.map((name, index) => (
              <li key={index}>{name} - {productPrices[index]}</li>
            ))}
          </ul>
        </div>
      );

}

export default ReturnPrices;