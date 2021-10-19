const eles = document.getElementById('data')
const eled1 = document.getElementById('location1')
const eled2 = document.getElementById('location2')
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


const locationfetcher = (location,element,imagerender,flag=false) => {
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
    
    xhttp.open("GET",'https://api.lufthansa.com/v1/flight-schedules/flightschedules/passenger?airlines=LH&startDate=10OCT21&endDate=16OCT21&daysOfOperation=1&timeMode=UTC',true)
    
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
    
    locationfetcher(destination,eled2,destinationImageSeries)
    locationfetcher(origin,eled1,originImageSeries)
    // counter++
    counter = Math.floor(Math.random() * data.length)
    
    showLines(originImageSeries.dataItems.getIndex(0));
    chart.validateData()
}

setInterval(changer,8000)
datafetcher()