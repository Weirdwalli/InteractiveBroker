var fxColumns = [ "EUR.USD", "USD.JPY", "GBP.USD", "AUD.USD", "USD.CNH", "USD.CHF", "USD.CAD", "USD.MXN" ];

$(function() {
        setInterval(function() {
                $.ajax({
                        type:           "GET",
                        cache:          false,
                        dataType:       'json',
                        url:            "/mkt/ticker/forexTicker.php",
                        data :          { 'src' : 'ib' },
                        success:        function(data, textStatus, jqXHR) {
                        if(data.error){
                                displayForexError();
                                console.log("data.error, ", data.error, " textStatus, ", textStatus);
                        } else {
                                var fxTable = $("#forexTable");
                                var bShowingSpread = (typeof bHideSpread == 'undefined' || !bHideSpread);
                                $(fxTable).html("");
                                for(var i = 0; i < fxColumns.length; ++i) {
                                        var fxRow = "<tr>";
                                        fxRow += createSymbolData(data[fxColumns[i]], bShowingSpread);
                                        if(i == 0) {
                                                fxRow += "<td rowspan=\"4\" width=\"1%\" class=\"fxdivider\"> </td>";
                                                fxRow += "<td rowspan=\"4\" width=\"3%\"> </td>";
                                        }
                                        fxRow += createSymbolData(data[fxColumns[++i]], bShowingSpread);
                                        fxRow += "</tr>";
                                        $(fxTable).append(fxRow);
                                }
                                $("#forexError").hide();
                                $("#forexLoading").hide();
                                $("#forexLoaded").show();
                        }
                },
                error:          function(jqXHR, textStatus, errorThrown) {
                                                        displayForexError();
                                                        console.log("error", textStatus, errorThrown);
                                                }
        })}, 6000);
});
function displayForexError() {
        $("#forexLoading").hide();
        $("#forexLoaded").hide();
        $("#forexError").show();
}
function createSymbolData(fxData, bShowSpread) {
        var cellData = "";
        if(fxData) {
                // Symbol
                cellData += "<td width=\"10%\" align=\"left\" valign=\"middle\" class=\"fxcurrency\">" + fxData.symbol + "</td>";
                // Bid
                cellData += "<td width=\"12%\" align=\"left\" valign=\"middle\" class=\"fxbidaskspread\">BID <span class=\"fxprice";
                if(fxData.diffb == "up")
                        cellData += " fxpriceup";
                else if(fxData.diffb == "down")
                        cellData += " fxpricedown";
                cellData += "\">" + fxData.bid + "</span></td>";
                // Ask
                cellData += "<td width=\"14%\" align=\"left\" valign=\"middle\" class=\"fxbidaskspread\">ASK <span class=\"fxprice";
                if(fxData.diffa == "up")
                        cellData += " fxpriceup";
                else if(fxData.diffa == "down")
                        cellData += " fxpricedown";
                cellData += "\">" + fxData.ask + "</span></td>";
                // Spread
                if(bShowSpread)
                        cellData += "<td width=\"12%\" align=\"left\" valign=\"middle\" class=\"fxbidaskspread\">SPRD <span class=\"fxprice\">" + fxData.sprd + "</span></td>";
                else
                        cellData += "<td> </td>";
        } else
                cellData += "<td width=\"12%\" align=\"left\" valign=\"middle\" colspan=\"4\"> </td>";
        return cellData;
}