const eles = document.getElementById('data')
const eled1 = document.getElementById('location1')
const eled2 = document.getElementById('location2')
const outs = document.getElementById('output')

var counter = 0
var data = []
var sorcname = {}
var destname = {}
var output = {}

const credentials = {
    "Authorization" : "Bearer 57wpjw9rmaxzu5vt42uf6be7",
    "Accept" : "application/json",
    "Content-type" : "application/json"
}

const setDate = (offset=0) =>{
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const dateObj = new Date();
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()-offset).padStart(2, '0');
    const year = dateObj.getFullYear().toString().substring(2,4);
    const output = day + month + year;
    console.log(output)
    return output
}

const locationfetcher = (location,element,imagerender,flag) => {
    const xhttp = new XMLHttpRequest()
    
    xhttp.onload = () =>{
        let text = []
        try{
            text = JSON.parse(xhttp.responseText)
            console.log('DATA FETCHED')
        }
        catch(errs)
        {
            console.log(xhttp.responseText)
            console.log('DATA NOT FETCHED')
        }

        let originx = text['AirportResource']['Airports']['Airport']['Position']['Coordinate']['Latitude']
        let originy = text['AirportResource']['Airports']['Airport']['Position']['Coordinate']['Longitude'] 
        let locationname = text['AirportResource']['Airports']['Airport']['Names']['Name'][0]['$']
        element.innerText = originx + " " + originy + " " + locationname + " " + location

        datalist = {
            "id":new Date().getTime(),
            "title":locationname,
            "latitude":originx,
            "longitude":originy,
            "destinations": destinationImageSeries.data.map((ele)=>ele.id),
        }

        imagerender.data = [datalist]
        if(flag==true){
            // showLines(originImageSeries.dataItems.getIndex(0));
            title.text = "Flight starts from " + datalist.title;
        }
    }
    
    xhttp.open("GET",`https://api.lufthansa.com/v1/references/airports/${location}`,true)
    
    for (let key in credentials) {
        // console.log(key,credentials[key])
        xhttp.setRequestHeader(key,credentials[key])        
    }

    xhttp.send()
}

const datafetcher = () => {
    const xhttp = new XMLHttpRequest()
    xhttp.onload = async () =>{
        try{
            data = JSON.parse(xhttp.responseText)
            console.log('DATA FETCHED')
        }
        catch(errs)
        {
            console.log(xhttp.responseText)
            console.log('DATA NOT FETCHED')
        }
    }
    
    datestart = setDate(7)
    dateend = setDate()

    xhttp.open("GET",`https://api.lufthansa.com/v1/flight-schedules/flightschedules/passenger?airlines=LH&startDate=${datestart}&endDate=${dateend}&daysOfOperation=1234567&timeMode=UTC`,true)
    
    for (let key in credentials) {
        // console.log(key,credentials[key])
        xhttp.setRequestHeader(key,credentials[key])        
    }
    xhttp.send()
}

const changer = () => {
    let origin = data[counter]["legs"][0]['origin']
    let destination = data[counter]["legs"][0]['destination']
    eles.innerText = "Source: " + origin+" Destination: "+destination
    console.log(origin,destination)
    
    locationfetcher(destination,eled2,destinationImageSeries,false)
    locationfetcher(origin,eled1,originImageSeries,true)
    // counter++

    arrive = data[counter].legs[0].aircraftArrivalTimeUTC.toString()
    arrive = `${arrive.substring(0,arrive.length-2)} : ${arrive.substring(arrive.length-2,arrive.length)} UTC`
    departure = data[counter].legs[0].aircraftDepartureTimeUTC.toString()
    departure = `${departure.substring(0,departure.length-2)} : ${departure.substring(departure.length-2,departure.length)} UTC`

    details = {
        "airline" : data[counter].airline,
        "startDate" : data[counter].periodOfOperationUTC.startDate,
        "endDate" : data[counter].periodOfOperationUTC.endDate,
        "ArrivalTime" : arrive,
        "DepartureTime" : departure,
        "AircraftType" : data[counter].legs[0].aircraftType
    }

    outs.innerHTML = ""    
    for(keys in details)
    {
        ptag = document.createElement("p")
        ptag.className="p-b-12"
        ptag.innerText = `${keys} : ${details[keys]}`
        outs.appendChild(ptag)
    }

    counter = Math.floor(Math.random() * data.length)
    
    // showLines(originImageSeries.dataItems.getIndex(0));
    chart.validateData()

}

setInterval(changer,20000)
datafetcher()