import React from 'react';
 import { useState, useEffect } from 'react';
import { getNews } from '../apis/apis.js';
import { formatDate } from "../utils/DateFormater";


const NewsPage = () => {


    const [news, setNews] = useState(null);
    const fetchNews = async () => {
        const response = await getNews(15); // Replace with actual API endpoint
        setNews(response.data.articles);
        console.log(news)

    };
    useEffect(() => {
        fetchNews();
    }, []);

    if (!news) {
        return (
            <div>
                <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">


                    <div className="flex space-x-4 mb-6">
                        <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                    </div>
                </div>

                <br />
                <div className="p-6 bg-surface-a0 rounded-lg shadow-lg">


                    <div className="flex space-x-4 mb-6">
                        <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-16 h-8 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                        <div className="w-full h-6 bg-surfaceTonal-a10 rounded animate-pulse"></div>
                    </div>
                </div>

            </div>



        );
    }
    return (
        <div className="mb-18 h-[62rem] space-y-4 overflow-y-auto no-scrollbar">
            {news.map((news, index) => (
                <div
                    key={index}
                    className="trending-news-item cursor-pointer"

                >
                    <a href={news.link} target="_blank" rel="noopener noreferrer">


                        <img src={news.imageUrl} alt="news" className="w-42 h-32 object-cover"/>

                        <h3 className="text-lg font-semibold">{news.headline}</h3>
                        <p className="text-sm">{news.description}</p>
                        <p className="text-xs text-gray-400"> {formatDate(news.datePublished)}</p>
                    </a>
                    {/* <p className="text-xs text-gray-400">{news.datePublished}</p> */}
                </div>
            ))}
        </div>
    );
}

export default NewsPage;
