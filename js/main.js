let colorOrange = "#F2A900";
let colorBlue = "#739DFF";
let colorBlack = "#282828";
let adoptedCountries;
fetch("https://raw.githubusercontent.com/schui95/legaltender21/main/resources/adopted_countries.json").then((r) => r.json()).then((data) => adoptedCountries = data);

fetch("https://raw.githubusercontent.com/schui95/legaltender21/main/resources/countries.json").then((r) => r.json()).then((data) => {
    let countries = ChartGeo.topojson.feature(data, data.objects.countries).features;
    new Chart(document.getElementById("canvas").getContext("2d"), {
        type: "choropleth",
        data: {
            labels: countries.map((c) => c.properties.name),
            datasets: [{
                label: "Countries",
                data: countries.map((c) => ({feature: c, value: (c.properties.name in adoptedCountries)? adoptedCountries[c.properties.name].blockheight:-1})),
                backgroundColor: countries.map((c) => (c.properties.name in adoptedCountries)? (adoptedCountries[c.properties.name].rank)? colorOrange: pattern.draw("diagonal", colorBlack, colorBlue, 6) : colorBlack)
            }]
        },
        options: {
            showOutline: false,
            showGraticule: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    bodyFont: {
                        size: 13
                    },
                    bodySpacing: 4,
                    borderWidth: 1,
                    borderColor: "#D3D3D3",
                    callbacks: {
                        label: function(context) {
                            let country = context.element.feature.properties.name;
                            if (country in adoptedCountries && adoptedCountries[country].rank) {
                                return `${country} #${adoptedCountries[country].rank}`;
                            }
                            return country;
                        },
                        afterBody: function(context) {
                            let country = context[0].element.feature.properties.name;
                            if (country in adoptedCountries && adoptedCountries[country].blockheight) {
                                return `Block Height: ${adoptedCountries[country].blockheight}`;
                            }
                            return "";
                        }
                    }   
                }
            },
            scales: {
                xy: {
                    projection: "equalEarth"
                },
                color: {
                    display: false
                } 
            },
            onClick: (evt, elems) => {
                if (elems.length < 1) {
                    return null;
                }
                let ctrlPressed = evt.native.ctrlKey;
                let country = elems[0].element.feature.properties.name;
                if (country in adoptedCountries && ctrlPressed && adoptedCountries[country].blockheight) { window.open(`https://mempool.space/block/${adoptedCountries[country].blockheight}`);} 
                else if (country in adoptedCountries) {window.open(adoptedCountries[country].source);}
                else { window.open("https://brrr.money/");}
            }
        }
    });
}); 