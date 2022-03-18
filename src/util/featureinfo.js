import GeoJSON from 'ol/format/GeoJSON';


const prettifyXml = (source) => {
    let xmlDoc = source;
    if(typeof source === 'string') {
        xmlDoc = new DOMParser().parseFromString(source, 'application/xml');
    }
    const xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    const xsltProcessor = new XSLTProcessor();    
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
};


/**
 * Method to parse the features from GetFeatureInfo response having the 
 * info_format = 'application/json'
 */
export const parseFeatureInfoJSON = (source) => {
    const features = new GeoJSON().readFeatures(source);
	/*
    console.log('newFeatures', features);
    features.forEach((feature) => {
        console.log('feature', feature);
    });
	*/
    return features;
};

/**
 * Method to parse the features from GetFeatureInfo response having the 
 * info_format = 'text/xml'
 */
export const parseFeatureInfoTextXml = (source) => {
    let xmlStr = prettifyXml(source);
    const feature =  {};
    const properties = {}
    properties['text/xml'] = xmlStr;
    feature['getProperties'] = () => properties;
    feature['getId'] = () => `text/xml.${Date.now()}`;
    
    return [feature];
}

/**
 * Method to parse the features from GetFeatureInfo response having the 
 * info_format = 'application/vnd.esri.wms_raw_xml'
'
 */
export const parseEsriWmsRawXml = (source) => {

    let doc = null;
    if(typeof source === 'string') {
        const parser = new DOMParser();
        doc = parser.parseFromString(source, "application/xml");
    }
    else {
        doc = source;
    }
    const features = [];
    const featureInfoCollectionEl = doc.getElementsByTagNameNS('http://www.esri.com/wms','FeatureInfoCollection');
    for(let k = 0; k < featureInfoCollectionEl.length; ++k) {
        const layerName = featureInfoCollectionEl[k].getAttribute('layername');
        const featureInfosEl = featureInfoCollectionEl[k].getElementsByTagNameNS('http://www.esri.com/wms','FeatureInfo');
        for(let i = 0; i < featureInfosEl.length; ++i) {
            const feature = {};
            const properties = {};
            const fieldsEl = featureInfosEl[i].getElementsByTagNameNS('http://www.esri.com/wms','Field');
            for(let j = 0; j < fieldsEl.length; ++j) {
                const fieldName = fieldsEl[j].getElementsByTagNameNS('http://www.esri.com/wms','FieldName')[0].childNodes[0].nodeValue;
                const fieldValue = fieldsEl[j].getElementsByTagNameNS('http://www.esri.com/wms','FieldValue')[0].childNodes[0].nodeValue;
                properties[fieldName] = fieldValue;
                
            }
            feature['getProperties'] = () => properties;
            feature['getId'] = () => `${layerName}.${i}`;
            features.push(feature);
        }
        return features;
    }
}

/**
 * Method to parse the features from GetFeatureInfo response having the 
 * info_format = 'application/vnd.esri.wms_featureinfo_xml'
 */
export const parseEsriWmsFeatureInfoXml = (source) => {
    let doc = null;
    if(typeof source === 'string') {
        const parser = new DOMParser();
        doc = parser.parseFromString(source, "application/xml");
    }
    else {
        doc = source;
    }
    const features = [];
    const featureInfoCollectionEl = doc.getElementsByTagNameNS('http://www.esri.com/wms', 'FeatureInfoCollection');
    for(let k = 0; k < featureInfoCollectionEl.length; ++k) {
        const layerName = featureInfoCollectionEl[k].getAttribute('layername');
        const featureInfosEl = featureInfoCollectionEl[k].getElementsByTagNameNS('http://www.esri.com/wms','FeatureInfo');
        for(let i = 0; i < featureInfosEl.length; ++i) {
            const feature = {};
            const properties = {};
            const fieldsEl = featureInfosEl[i].getElementsByTagNameNS('http://www.esri.com/wms',"Field");
            for(let j = 0; j < fieldsEl.length; ++j) {
                const fieldName = fieldsEl[j].getElementsByTagNameNS('http://www.esri.com/wms','FieldName')[0].innerHTML;
                const fieldValue = fieldsEl[j].getElementsByTagNameNS('http://www.esri.com/wms','FieldValue')[0].innerHTML;
                properties[fieldName] = fieldValue;
                
            }
            feature['getProperties'] = () => properties;
            feature['getId'] = () => `${layerName}.${i}`;
            features.push(feature);
        }
        return features;
    }
};

export const parseFeatureInfo = (source, infoFormat) => {
    switch(infoFormat) {
        case 'application/json':
            return parseFeatureInfoJSON(source);
        case 'application/vnd.esri.wms_featureinfo_xml':
            return  parseEsriWmsFeatureInfoXml(source);
        case 'application/vnd.esri.wms_raw_xml':
            return parseEsriWmsRawXml(source);
        case 'text/xml':
            return parseFeatureInfoTextXml(source);
        default:
            return parseFeatureInfoJSON(source);
    }
}