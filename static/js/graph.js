

queue()
    .defer(d3.json, "/data")
    .await(makeGraph)

function makeGraph(error, grandslamData){
    let ndx = crossfilter(grandslamData)
    
    
    grandslamData.forEach(function (d) {
        d.WRank = parseInt((d.WRank))
        d.LRank = parseInt((d.LRank));
        d.total_games_won = d.W1 + d.W2 + d.W3 + d.W4 + d.W5;
        d.total_games_lost = d.L1 + d.L2 + d.L3 + d.L4 + d.L5;
    })
    
    // var parseDate = d3.time.format("%m/%d/%Y").parse;
    
    //  grandslamData.forEach(function(d){
    //         d.date = parseDate(d.date);
    //     });
    
    show_tournament(ndx);
    show_test(ndx);
    show_test1(ndx);
    show_sets_won_loss(ndx, "Wsets", "#sets_won");
    show_sets_won_loss(ndx, "Lsets", "#sets_loss");
    show_games_won_loss(ndx, "total_games_won", "#games_won");
    show_games_won_loss(ndx, "total_games_lost", "#games_lost");
    show_average_winner(ndx);
    show_average_loser(ndx);
    show_surface(ndx);
    show_winner_chart(ndx);
    show_final_wins(ndx);
    show_final_losses(ndx);
    
   
   
    
dc.renderAll();
    
}



function show_tournament(ndx) {
    let series = ndx.dimension(dc.pluck('Tournament'));
    let count_by_series = series.group().reduceCount();
    
    dc.pieChart("#tournament")
        .height(330)
        .radius(120)
        .dimension(series)
        .group(count_by_series)
        .transitionDuration(500);
}




function show_test(ndx) {
    let discipline_dim = ndx.dimension(dc.pluck('Winner'))
    let discipline_group = discipline_dim.group()
    
    dc.selectMenu("#test")
        .dimension(discipline_dim)
        .group(discipline_group)
}

function test(ndx, name) {
    let gender_dim = ndx.dimension(dc.pluck('Series'))
    return gender_dim.group().reduce(
            function (p, v) {
               
                    p.total_found += 1;
                    if (v.Tournament == name) {
                        p.are_prof += 1;
                    }
                    p.percent = (p.are_prof / p.total_found);  
                
                return p;
            },
            function (p, v) {
                
                    p.total_found -= 1;
                    if(p.total_found > 0) {                
                        if (v.Tournament == name) {
                            p.are_prof -= 1;
                        }
                        p.percent = (p.are_prof / p.total_found);
                    } else {
                        p.are_prof = 0;
                        p.percent = 0;
                    }
                
                return p;
            },
            
            function () {
                return { total_found: 0, are_prof: 0, percent: 0 };
                
            });
  
}


function show_test1(ndx) {
     let gender_dim = ndx.dimension(dc.pluck('Tournament'))
    
     let australian = test(ndx, "Australian Open");    
     let french = test(ndx, "French Open");
     let british = test(ndx, "Wimbledon");
     let us = test(ndx, "US Open");
     
     dc.barChart("#test1")
        .width(300)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(gender_dim)
        .group(australian)
        .stack(french)
        .stack(british)
        .stack(us)
        .transitionDuration(500)
        .valueAccessor( function(d) {
            return d.value.percent;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Tournament")
        .yAxis().ticks(4);
        
    
}








function show_sets_won_loss(ndx, win_loss, element) {
    let winnerDim = ndx.dimension(dc.pluck("Round"));
    var winnerGroup = winnerDim.group().reduceSum(dc.pluck(win_loss));
    
    dc.numberDisplay(element)
        .formatNumber(d3.format())
        .dimension(winnerDim)
        .group(winnerGroup);
}


function show_games_won_loss(ndx, won_loss, element) {
    let winnerDim = ndx.dimension(dc.pluck("Series"));
    let setOne = winnerDim.group().reduceSum(dc.pluck(won_loss))
   
    
    dc.numberDisplay(element)
        .formatNumber(d3.format())
        .dimension(winnerDim)
        .group(setOne);
}



function show_average_winner(ndx) {
    var name_dim = ndx.dimension(dc.pluck('Round'));
        
        function add_item(p, v) {
            p.count ++;
            p.total += v.WRank;
            p.average = p.total / p.count;
            return p;
        }
        function remove_item(p, v){
            p.count --;
            if (p.count > 0) {
                p.total -= v.WRank;
                p.average = p.total / p.count;
            } else {
                p.total = 0;
                p.average = 0;
            }
            return p;
        }
        function init() {
            return {count: 0, total: 0, average: 0 }
        }
        
        var average_winner = name_dim.group().reduce(add_item, remove_item, init);

        dc.numberDisplay("#average_winner")
            .formatNumber(d3.format(".2f"))
            .dimension(name_dim)
            .group(average_winner)
            .valueAccessor(function(p){
                return p.value.average;
            });
            
}



function show_average_loser(ndx) {
    var name_dim = ndx.dimension(dc.pluck('Round'));
        
        function add_item(p, v) {
            p.count ++;
            p.total += v.LRank;
            p.average = p.total / p.count;
            return p;
        }
        function remove_item(p, v){
            p.count --;
            if (p.count > 0) {
                p.total -= v.LRank;
                p.average = p.total / p.count;
            } else {
                p.total = 0;
                p.average = 0;
            }
            return p;
        }
        function init() {
            return {count: 0, total: 0, average: 0 }
        }
        
        var average_loser = name_dim.group().reduce(add_item, remove_item, init);

        dc.numberDisplay("#average_loser")
            .formatNumber(d3.format(".2f"))
            .dimension(name_dim)
            .group(average_loser)
            .valueAccessor(function(p){
                return p.value.average;
            });
            
}








function show_surface(ndx) {
    let surface = ndx.dimension(dc.pluck('Surface'))
    let count_matches_by_surface = surface.group().reduceCount();
    
    
    
    dc.pieChart("#surface")
        .height(330)
        .radius(120)
        .dimension(surface)
        .group(count_matches_by_surface)
        .transitionDuration(500);
}



function show_winner_chart(ndx) {
    var winnerDim = ndx.dimension(dc.pluck("Winner"));
    var winnerGroup = winnerDim.group();
    var roundDim = ndx.dimension(dc.pluck("Round"));
    roundDim.filter('The Final');
    function filter_not_zero(source_group) {
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    return d.value > 0;
                });
            }
        };
    }
    winnerGroup = filter_not_zero(winnerGroup);
    dc.barChart("#number_of_wins")
        .width(800)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(winnerDim)
        .group(winnerGroup)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Winner")
        .yAxis().ticks(4);
}



function show_final_wins(ndx) {
        var year = ndx.dimension(dc.pluck('Year'));
        
        
       
        // var dateDim = ndx.dimension(function(d){
        //     return d.date;
        // });
        
    
        var minDate = year.bottom(1)[0].Year;
        var maxDate = year.top(1)[0].Year;
    
    
    
        function grandslamsByWinner(name) {
            return year.group().reduceSum(function (d) {
                if (name == "Federer R." || name == "Nadal R." || name == "Djokovic N.") {
                    if (d.Winner == name ) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (d.Winner != "Federer R." && d.Winner != "Nadal R." && d.Winner != "Djokovic N." ) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    
    
        let federerWins = grandslamsByWinner("Federer R.")
        let nadalWins = grandslamsByWinner("Nadal R.")
        let djokovicWins = grandslamsByWinner("Djokovic N.")
        let otherWins = grandslamsByWinner("other")
        
    
        let compositeChart = dc.compositeChart('#wins_by_year');
        compositeChart
            .width(1000)
            .height(200)
            .dimension(year)
            .x(d3.time.scale().domain([minDate, maxDate]))
            
            .yAxisLabel("Final Wins")
            .legend(dc.legend().x(900).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(federerWins, 'Federer R.'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(nadalWins, 'Nadal R.'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(djokovicWins, 'Djokovic N.'),
                dc.lineChart(compositeChart)
                    .colors('yellow')
                    .group(otherWins, 'Other')
            ])
            .brushOn(false)
            .render()
            .yAxis().ticks(4);
}  

function show_final_losses(ndx) {
        var year = ndx.dimension(dc.pluck('Year'));
        
    
        var minDate = year.bottom(1)[0].Year;
        var maxDate = year.top(1)[0].Year;
    
    
    
        function grandslamsByLoser(name) {
            return year.group().reduceSum(function (d) {
                if (name == "Federer R." || name == "Nadal R." || name == "Djokovic N.") {
                    if (d.Loser == name ) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (d.Loser != "Federer R." && d.Loser != "Nadal R." && d.Loser != "Djokovic N." ) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    
    
        let federerLosses = grandslamsByLoser("Federer R.")
        let nadalLosses = grandslamsByLoser("Nadal R.")
        let djokovicLosses = grandslamsByLoser("Djokovic N.")
        let otherLosses = grandslamsByLoser("other")
        
    
        let compositeChart = dc.compositeChart('#losses_by_year');
        compositeChart
            .width(1000)
            .height(200)
            .dimension(year)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .yAxisLabel("Final Losses")
            .legend(dc.legend().x(900).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(compositeChart)
                    .colors('green')
                    .group(federerLosses, 'Federer R.'),
                dc.lineChart(compositeChart)
                    .colors('blue')
                    .group(nadalLosses, 'Nadal R.'),
                dc.lineChart(compositeChart)
                    .colors('red')
                    .group(djokovicLosses, 'Djokovic N.'),
                dc.lineChart(compositeChart)
                    .colors('yellow')
                    .group(otherLosses, 'Other')
            ])
            .brushOn(false)
            .render()
            .yAxis().ticks(4);
}  
  