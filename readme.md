TODO
=======
* continue with states
* code to check if file has changed
    * checksum or just redo json
* break up download.js
* look into https://github.com/tobyhede/postsql
* setup on heroku
* look at historical tenements

NT Data
========
=== Mining ===
* no company data
* no timestamps
* has status of mine (not that may are active)

WA Mining
==========
mostly esri files

tenements: ok
`{ "type": "Feature", "properties": { "TENID": "AG 7000013", "TYPE": "GENERAL PURPOSE LEASE S.A.", "SURVSTATUS": "SURVEYED", "TENSTATUS": "LIVE", "HOLDERCNT": 1.0, "HOLDER1": "ONSLOW SALT PTY LTD", "ADDR1": "PO BOX 23,ONSLOW,WA,6710", "HOLDER2": null, "ADDR2": null, "HOLDER3": null, "ADDR3": null, "HOLDER4": null, "ADDR4": null, "HOLDER5": null, "ADDR5": null, "HOLDER6": null, "ADDR6": null, "HOLDER7": null, "ADDR7": null, "HOLDER8": null, "ADDR8": null, "HOLDER9": null, "ADDR9": null, "STARTDATE": "1999\/11\/22", "STARTTIME": "09:30:00", "ENDDATE": "2017\/04\/15", "ENDTIME": "23:59:59", "GRANTDATE": "1996\/04\/16", "GRANTTIME": "00:00:00", "FMT_TENID": "G 13SA", "LEGAL_AREA": 4.735, "UNIT_OF_ME": "HA.", "SPECIAL_IN": null, "EXTRACT_DA": "2013\/03\/07", "COMBINED_R": null, "ALL_HOLDER": "ONSLOW SALT PTY LTD" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 115.098663055010192, -21.65962234860228 ], [ 115.100223077368355, -21.657897769228359 ], [ 115.101127570636351, -21.662194485769827 ], [ 115.098663055010192, -21.65962234860228 ] ] ] } }`

QLD
====

tar files hidden behind register `https://webgis.dme.qld.gov.au/webgis/webqmin/shapes/csgwells.tar`

Work fine once converted to zip.

SA
===
Post to https://sarig.pir.sa.gov.au/Map/Download/Download/

form data: `DownloadFile.Format=SHP&DownloadFile.Projection=&DownloadFile.FileNames=Major+Mines&DownloadFile.MultiZip=false&DownloadFile.DownloadName=Major+Mines&DownloadFile.ImageDownloadFlag=N`

NSW
====
Bit tricky
`http://minview.minerals.nsw.gov.au/mv2web/mv2?cmd=FileDownload&xmin=136.92857142857144&ymin=-39.42857142857143&xmax=158.08928571428572&ymax=-26.57142857142857&llist=minttl&file=.minttl,136_9286,-39_4286,158_0893,-26_5714`
downloads as cpgz file that contains a zip with shape files

TAS
====
Pretty straightforward

