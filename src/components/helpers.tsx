
export const convertedDate = (date: any) => {
    // console.log(date)
    date = (date * 1000);
    let convertedDate = new Date (date);
    // console.log(convertedDate);
    return convertedDate.toString();
}

export const convertedValue = (value: any) => {
    // console.log(value)
    let convertedValue = (value);
    if(convertedValue === undefined){
        convertedValue = 0;
    }
    else {
        convertedValue = convertedValue / 1000000000000000000;
    }
    return convertedValue;
}

// export const getcurrentPrice = async () => {
//     let response: any = await fetch('https://coinograph.io/ticker/?symbol=gdax:ethusd'); //api call for symbol information
//     let symbolData: any = await response.json();
//     console.log("symbolData", symbolData.price);
//     return symbolData.price;
// }

// export const setTimeout(() => {
//     run(bot);
//     }, 1000 * 60);