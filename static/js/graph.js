

queue()
    .defer(d3.json, "/data")
    .await(makeGraph)

function makeGraph(error, grandslamData){
    let ndx = crossfilter(grandslamData)
    
    
    
    let parseDate = d3.time.format("%d/%m/%Y").parse;
    grandslamData.forEach(function (d) {
        d.WRank = parseInt((d.WRank));
        d.LRank = parseInt((d.LRank));
        d.wsets = parseInt((d.Wsets));
        d.lsets = parseInt((d.Lsets));
        d.total_games_won = d.W1 + d.W2 + d.W3 + d.W4 + d.W5;
        d.total_games_lost = d.L1 + d.L2 + d.L3 + d.L4 + d.L5;
        d.gameswon = parseInt((d.total_games_won));
        d.gameslost = parseInt((d.total_games_lost));
        // d.year = parseInt(d.year);
        d.Date = parseDate(d.Date);
        d.Year = d.Date.getFullYear();
        // d.Date = Date.parse(d.Date);
    })
    
    
    
    
    show_player(ndx);
    show_tournament(ndx);
    // show_test1(ndx);
    show_sets_won_loss(ndx, "Wsets", "#sets_won");
    show_sets_won_loss(ndx, "Lsets", "#sets_loss");
    show_games_won_loss(ndx, "total_games_won", "#games_won");
    show_games_won_loss(ndx, "total_games_lost", "#games_lost");
    show_average_winner(ndx);
    show_average_loser(ndx);
    show_surface(ndx);
    show_winner_chart(ndx);
    // show_final_wins(ndx);
    // show_final_losses(ndx);
    scatter(ndx);
    // show_rankings(ndx);
    show_row_chart(ndx);
    show_average_winner_barchart(ndx);
    show_percent_set_win(ndx);
    show_percent_game_win(ndx);
    
dc.renderAll();
    
}
function show_percent_game_win(ndx) {
    
    let name_dim = ndx.dimension(dc.pluck('Series'));
      
 
    let win_percent = get_percent_game_win_loss(ndx, "gameswon");
    let loss_percent = get_percent_game_win_loss(ndx, "gameslost");
   
        
    dc.barChart("#gamewinpercent")
        .width(200)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(win_percent)
        .stack(loss_percent)
        .transitionDuration(500)
        .valueAccessor( function(d) {
            return d.value.percent;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(350).y(10).itemHeight(13).gap(5))
        .xAxisLabel("Games")
        .yAxis().tickFormat(d3.format(".0%"));
}

function get_percent_game_win_loss(ndx, rank) {
    let name_dim = ndx.dimension(dc.pluck('Series'));
    return name_dim.group().reduce(
        function (p, v) {
            if (rank == "gameswon"){
                p.win += v.gameswon
                console.log(p.win)
                p.total += v.gameswon + v.gameslost;
                p.percent = (p.win/ p.total);
            } else {
                p.win += v.gameslost
                p.total += v.gameswon + v.gameslost;
                p.percent = (p.win/ p.total);
            }
            return p;
        },
        function (p, v) {
            if (rank == "gameswon"){
                p.win -= v.gameswon
                p.total -= (v.gameswon + v.gameslost);
                p.percent = (p.win/ p.total);
            } else {
                p.win -= v.gameslost
                p.total -= (v.gameswon + v.gameslost);
                p.percent = (p.win/ p.total);
            }
            return p;
        },
        function () {
            return { total: 0, win: 0, percent: 0 };
        });
}
function show_percent_set_win(ndx) {
    
    let name_dim = ndx.dimension(dc.pluck('Series'));
      
 
    let win_percent = get_percent_win_loss(ndx, "wsets");
    let loss_percent = get_percent_win_loss(ndx, "lsets");
   
        
    dc.barChart("#setwinpercent")
        .width(200)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(win_percent)
        .stack(loss_percent)
        .transitionDuration(500)
        .valueAccessor( function(d) {
            return d.value.percent;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Sets")
        .legend(dc.legend().x(350).y(10).itemHeight(13).gap(5))
        .yAxis().tickFormat(d3.format(".0%"));
}

function get_percent_win_loss(ndx, rank) {
    let name_dim = ndx.dimension(dc.pluck('Series'));
    return name_dim.group().reduce(
        function (p, v) {
            if (rank == "wsets"){
                p.win += v.wsets
                if (Number.isInteger(v.lsets)) {
                    p.total += v.wsets + v.lsets;
                } else {
                    p.total += v.wsets
                }
                p.percent = (p.win/ p.total);
            } else {
                if (Number.isInteger(v.lsets)) {
                    p.win += v.lsets
                    p.total += v.wsets + v.lsets;
                } else {
                    p.total += v.wsets
                }
                p.percent = (p.win/ p.total);
            }
            return p;
        },
        function (p, v) {
            if (rank == "wsets"){
                p.win -= v.wsets
                if (Number.isInteger(v.lsets)) {
                    p.total -= (v.wsets + v.lsets);
                } else {
                    p.total -= v.wsets
                }
                p.percent = (p.win/ p.total);
            } else {
                if (Number.isInteger(v.lsets)) {
                    p.win -= v.lsets
                    p.total -= (v.wsets + v.lsets);
                } else {
                    p.total -= v.wsets
                }
                p.percent = (p.win/ p.total);
            }
            return p;
        },
        function () {
            return { total: 0, win: 0, percent: 0 };
        });
}

function show_average_winner_barchart(ndx) {
    
    let name_dim = ndx.dimension(dc.pluck('Tournament'));
        
    let average_winner = get_average_rank_by_win_loss(ndx, "WRank");
    let average_loser = get_average_rank_by_win_loss(ndx, "LRank");
    
    
    let chart = dc.barChart("#awr");
    chart
        .width(400)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(average_winner, "Winner")
        .stack(average_loser, "Loser")
        .transitionDuration(500)
        .valueAccessor( function(d) {
            return d.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Tournament")
        .legend(dc.legend().x(350).y(10).itemHeight(13).gap(5))
        .yAxis().ticks(20);
}

function get_average_rank_by_win_loss(ndx, rank) {
    let name_dim = ndx.dimension(dc.pluck('Tournament'))
    return name_dim.group().reduce(
        function (p, v) {
            p.count ++;
            if (rank == "WRank") {
                p.total += v.WRank;
            }
            else {
                p.total += v.LRank;
            }
            p.average = p.total / p.count;
            
            return p;
        },
        function (p, v) {
            p.count --;
            if (p.count > 0) {
                if (rank == "WRank") {
                    p.total -= v.WRank;
                }
                else {
                    p.total -= v.LRank;
                }
                p.average = p.total / p.count;
            } else {
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function () {
            return {count: 0, total: 0, average: 0 };
        });
}

function scatter(ndx){
    
    let date_dim = ndx.dimension(dc.pluck('Year'))
          
    let min_date = date_dim.bottom(1)[0].Year;
    let max_date = date_dim.top(1)[0].Year;     

    let tournament_dim = ndx.dimension(function(d) {
        
        return [d.Tournament, d.Year, d.Winner];
        
    })

    let tournament_group = tournament_dim.group();
    
    let winnerColors = d3.scale.ordinal()
        .domain(["Federer R.", "Djokovic N.", "Nadal R.", "Wawrinka S.", "Safin M.", "Roddick A.", "Murray A.", 
            "Gaudio G.", "Ferrero J.C", "Del Potro J.M.", "Cilic M.", "Agassi A."])
        .range(["red", "orange", "blue", "green", "green", "green", "green", "green", "green", "green", "green", "green"]);


    let y_axis = d3.scale.ordinal()
        .domain(['Australian Open', 'French Open', 'Wimbledon', 'US Open'])
        .range([380, 380 * 2/3, 380 * 1/3, 0]);
        
    console.log(y_axis.domain())
    console.log(y_axis.range())

    // let subChart = function(c) {
    //     return dc.scatterPlot(c)
    //         .symbolSize(8)
    //         .highlightSize(10)
    // }
    let scatterPlot = dc.scatterPlot("#scatter")
    scatterPlot
        .width(500)
        .height(666)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .x(d3.scale.ordinal().domain(['Australian Open', 'French Open', 'Wimbledon', 'US Open']).range(['1', '2', '3', '4']))
        .xUnits(dc.units.ordinal)
        .y(d3.time.scale().domain([max_date + 1, min_date]))
        // .y(d3.scale.ordinal().domain(['Australian Open', 'French Open', 'Wimbledon', 'US Open']).range(['1', '2', '3', '4']))
        // .y(y_axis)
        // .yUnits(dc.units.ordinal)
        .brushOn(true)
        .symbolSize(10)
        .clipPadding(10)
        // .yAxisLabel("Year")
        .colorAccessor(function (d) {
            return d.key[2]
        })
        .colors(winnerColors)
        .title(function (d) {
            return d.key[2] + " won the " + d.key[0] + " in " +d.key[1]
        })
        .dimension(tournament_dim)
        .group(tournament_group)
        .yAxis().ticks(14);
    scatterPlot
        .yAxis().tickFormat(d3.format("d"))   
             
}

function show_row_chart(ndx){

    let dim = ndx.dimension(dc.pluck('Surface'));
    var group = dim.group().reduceCount();
    let chart = dc.rowChart("#row_chart");
    chart
        .width(400)
        .height(330)
        .dimension(dim)
        .group(group)
        .xAxis().ticks(4);

}


function show_tournament(ndx) {
    
    let series = ndx.dimension(dc.pluck('Tournament'));
    let count_by_series = series.group().reduceCount();
    
    dc.pieChart("#tournament")
        .width(300)
        .height(300)
        .slicesCap(4)
        .dimension(series)
        .group(count_by_series)
        .transitionDuration(500);
}


function show_select_discipline(ndx) {
    let discipline_dim = ndx.dimension(dc.pluck('discipline'))
    let discipline_group = discipline_dim.group()
    
    dc.selectMenu("#select-discipline")
        .dimension(discipline_dim)
        .group(discipline_group)
}

function show_player(ndx) {
    
    let discipline_dim = ndx.dimension(dc.pluck('Tournament'))
    let discipline_group = discipline_dim.group()
    
    
    dc.selectMenu("#player")
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
    let winnerGroup = winnerDim.group().reduceSum(dc.pluck(win_loss));
    
    dc.numberDisplay(element)
        .formatNumber(d3.format())
        .dimension(winnerDim)
        .group(winnerGroup);
        
    
}


function show_games_won_loss(ndx, won_loss, element) {
    
    let winnerDim = ndx.dimension(dc.pluck("Series"));
    let games_won_lost = winnerDim.group().reduceSum(dc.pluck(won_loss))
   
    dc.numberDisplay(element)
        .formatNumber(d3.format())
        .dimension(winnerDim)
        .group(games_won_lost);
}



function show_average_winner(ndx) {
    
    let name_dim = ndx.dimension(dc.pluck('Round'));
        
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
    
    let average_winner = name_dim.group().reduce(add_item, remove_item, init);

    dc.numberDisplay("#average_winner")
        .formatNumber(d3.format(".2f"))
        .dimension(name_dim)
        .group(average_winner)
        .valueAccessor(function(p){
            return p.value.average;
        });
}



function show_average_loser(ndx) {
    
    let name_dim = ndx.dimension(dc.pluck('Round'));
        
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
    
    let average_loser = name_dim.group().reduce(add_item, remove_item, init);

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
        .radius(200)
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
    
        let year = ndx.dimension(dc.pluck('Year'));
       
        let minDate = year.bottom(1)[0].Year;
        let maxDate = year.top(1)[0].Year;
    
    
    
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
            // .x(d3.time.scale().domain([minDate, maxDate]))
            // .x(d3.scale.linear().domain([minDate,maxDate]))
            .x(d3.time.scale().domain([minDate,maxDate]))
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
        compositeChart
            .xAxis().tickFormat(d3.format("d"));
}  

function show_final_losses(ndx) {
    
        let year = ndx.dimension(dc.pluck('Year'));
        
        let minDate = year.bottom(1)[0].Year;
        let maxDate = year.top(1)[0].Year;
    
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
        compositeChart
            .xAxis().tickFormat(d3.format("d"));
}  



function show_rankings(ndx) {
    
    let dateDim = ndx.dimension(dc.pluck('Year'));
    let win_rank = dateDim.group().reduceSum(function(d) {return d.WRank;});
    let lose_rank = dateDim.group().reduceSum(function(d) {return d.LRank;});
    
    let minDate = dateDim.bottom(1)[0].Year;
    let maxDate = dateDim.top(1)[0].Year;
    
    
    let rankinglineChart = dc.lineChart("#rankings");
    
    rankinglineChart
    	.width(800).height(300)
    	.dimension(dateDim)
    	.group(win_rank, "Winners Ranking")
    	.stack(lose_rank, "Losers Ranking")
    	.renderArea(true)
    	.brushOn(false)
    	.x(d3.time.scale().domain([minDate,maxDate]))
    	.legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
    // 	.y(d3.scale.linear())
    	.yAxisLabel("Ranking");
    rankinglineChart
            .xAxis().tickFormat(d3.format("d"));
    
    
}
  