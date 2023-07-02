import https from 'https';
import * as win from 'windows-1252';
import * as htmlParser from 'node-html-parser';
import pdf2html from '@dsardar099/pdf-to-html';
import * as fs from 'fs';

const request = url => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
            let data = Buffer.from("");
            res.on("data", chunk => data = Buffer.concat([data, chunk]))
            res.on("end", () => resolve(data))
            res.on("error", reject)
        })
        req.on("error", reject)
    })
}

class Element {
    /**
     * 
     * @param {string} type 
     * @param {string} text 
     * @param {string} href
     * @param {Element[] | undefined} children
     */
    constructor(type, text, href, children) {
        this.type = type;
        this.text = text;
        this.href = href;
        this.children = children?.length ? children : undefined;
    }
}

/**
 * 
 * @param {htmlParser.HTMLElement} element 
 */
const nodeFilter = element => {
    return element.nodeType == htmlParser.NodeType.ELEMENT_NODE
        && !["br"].includes(element.tagName.toLowerCase());
}

/**
 * 
 * @param {htmlParser.HTMLElement} element 
 */
const getText = (element, force) => {
    if (element.nodeType === htmlParser.NodeType.TEXT_NODE) {
        return element.text;
    }
    let str = "";
    let i = 0;
    for (const node of element.childNodes) {
        if (node.nodeType === htmlParser.NodeType.TEXT_NODE || force) {
            str += getText(node, force);
        } else {
            str += `[${i}]`;
            i++;
        }
    }
    return str;
}

/**
 * 
 * @param {htmlParser.HTMLElement} element 
 * @param {boolean} force
 */
const getHref = (element, force) => {
    if (element.tagName === "A") {
        return element.attributes.href;
    } else if (force) {
        return element.childNodes.map(c => getHref(c, force)).filter(h => h)[0] || null;
    }
    return null;
}

/**
 * 
 * @param {htmlParser.HTMLElement[]} elems 
 */
const parse = elems => {
    const res = [];
    for (let i = 0; i < elems.length; i++) {
        if (elems[i].nodeType !== htmlParser.NodeType.ELEMENT_NODE) {
            continue;
        }
        switch (elems[i].tagName) {
            case "H1":
            case "H2":
            case "H3":
                const next = elems.slice(i + 1).findIndex(e => e.tagName === elems[i].tagName);
                res.push(new Element(
                    elems[i].tagName,
                    getText(elems[i], true),
                    getHref(elems[i], true),
                    parse(elems.slice(i + 1, next === -1 ? undefined : i + 1 + next))
                ));
                if (next === -1) {
                    i = elems.length;
                } else {
                    i = i + next;
                }
                break;
            case "UL":
                res.push(new Element(
                    elems[i].tagName,
                    getText(elems[i]),
                    "",
                    parse(elems[i].childNodes)
                ));
                break;
            case "BR":
                res.push(new Element(elems[i].tagName, "", ""));
                break;
            case "A":
                res.push(new Element(
                    elems[i].tagName, 
                    getText(elems[i], true), 
                    getHref(elems[i]),
                    undefined
                ));
                break;
            case "DIV":
                break;
            default:
                res.push(new Element(
                    elems[i].tagName, 
                    getText(elems[i]), 
                    null,
                    elems[i].childNodes.length > 0 ? parse(elems[i].childNodes) : undefined
                ));
                break;
        }
    }
    return res;
}

export default {
    /**
     * 
     * @param {string} url 
     * @returns {Element[] | string}
     */
    load: async url => {
        const res = await request("https://computerix.info/" + url);
        console.log(res);
        switch (url.replace(/.*\./, "")) {
            case "pdf":
                fs.writeFileSync("tmp.pdf", res);
                const converter = new pdf2html("tmp.pdf", "tmp.html");
                await converter.convert("default");
                return fs.readFileSync("tmp.html");
            case "c":
            case "cpp":
                return res.toString("utf-8");
            default:
                return parse(htmlParser.parse(win.decode(res)).querySelectorAll("body > *").filter(nodeFilter));
        }
    }
}