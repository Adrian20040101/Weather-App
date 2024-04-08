import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemPanel, AccordionItemButton } from "react-accessible-accordion";
import './forecast-weather.css';

const week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Forecast = ({data}) => {
    const dayInTheWeek = new Date().getDay();
    const forecastDays = week_days.slice(dayInTheWeek, week_days.length).concat(week_days.slice(0, dayInTheWeek));

    return  (
        <>
            <label className="title"> Daily </label>
            <Accordion allowZeroExpanded>
                {data.list.splice(0, 7).map((item, index) => (
                    <AccordionItem key={index}>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className="daily-item">
                                    <img alt="weather" className="icon-small" src={`icons/${item.weather[0].icon}.png`}/>
                                    <label className="day">{forecastDays[index]}</label>
                                    <label className="description">{item.weather[0].description}</label>
                                    <label className="min-max-temp">
                                        {Math.round(item.main.temp_min)}°C / {Math.round(item.main.temp_max)}°C
                                    </label>

                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="daily-details">
                                <div className="daily-details-item">
                                    <label> Pressure </label>
                                    <label> {item.main.pressure}ha </label>
                                </div>
                                <div className="daily-details-item">
                                    <label> Humidity </label>
                                    <label> {item.main.humidity}% </label>
                                </div>
                                <div className="daily-details-item">
                                    <label> Clouds </label>
                                    <label> {item.clouds.all}% </label>
                                </div>
                                <div className="daily-details-item">
                                    <label> Wind Speed </label>
                                    <label> {item.wind.speed} m/s </label>
                                </div>
                                <div className="daily-details-item">
                                    <label> Sea Level </label>
                                    <label> {item.main.sea_level} m </label>
                                </div>
                                <div className="daily-details-item">
                                    <label> Feels Like </label>
                                    <label> {Math.round(item.main.feels_like)}°C </label>
                                </div>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    );
}

export default Forecast;