const axios = require("axios");
const fs = require("fs");

const request = async body => {
    var data = new FormData();
    data.append("age", body.age);
    data.append("height", body.height);
    data.append("haircolor", body.haircolor);
    data.append("hair", body.hair);
    data.append("eyecolor", body.eyecolor);
    data.append("beard", body.beard);
    data.append("body", body.body);
    data.append("gender", "male");

    const res = await axios({
        method: 'post',
        url: 'https://kamelrechner.eu/de/result',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.match(/<span class="result">(?<result>\d+)<\/span>/).groups.result
}

const settings = {
    age: {
        min: 14,
        max: 70
    },
    height: {
        min: 140,
        max: 220
    },
    haircolor: {
        values: ["blonde", "brown", "black", "red", "grey"]
    },
    hair: {
        values: ["long", "middle", "short"]
    },
    eyecolor: {
        values: ["blue", "green", "brown", "grey"]
    },
    beard: {
        values: ["none", "small", "middle", "large"]
    },
    body: {
        values: ["muscle", "normal", "chubby"]
    }
}

const defaults = {
    age: 22,
    height: 176,
    haircolor: "blonde",
    hair: "long",
    eyecolor: "blue",
    beard: "none",
    body: "muscle"
}

async function getResults() {
    const results = {};
    for (const key of Object.keys(settings)) {
        console.log("getting results for", key);
        const config = settings[key];
        const result = [];
        let values = config.values;
        if (!values) {
            values = Array.from(Array(config.max - config.min + 1)).map((v, i) => i + config.min);
        }
        for (const value of values) {
            console.log("    at value", value);
            const body = Object.assign({}, defaults);
            body[key] = value;
            try {
                result.push({
                    value: value,
                    result: Number(await request(body)) - 70
                });
            } catch (e) {
                console.error(e);
            }
        }
        results[key] = result;
    }
    console.log(results);
    fs.writeFileSync("results.json", JSON.stringify(results, null, 4));
}

getResults();