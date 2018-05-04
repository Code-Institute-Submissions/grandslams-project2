$(document).ready(function(){
    
              $(".wim").click(function() {
            $(".wimbledon").fadeIn(2000);
            $(".grandslams").hide();
            $(".australian").hide();
            $(".us").hide();
            $(".french").hide();
            $(".wim").css("border", "#000080 8px solid");
            $(".aus").css("border", "black 4px solid");
            $(".u_s").css("border", "black 4px solid");
            $(".fre").css("border", "black 4px solid");
        });
        $(".aus").click(function() {
            $(".australian").fadeIn(2000);
            $(".grandslams").hide();
            $(".wimbledon").hide();
            $(".us").hide();
            $(".french").hide();
            $(".wim").css("border", "black 4px solid");
            $(".aus").css("border", "#000080 8px solid");
            $(".u_s").css("border", "black 4px solid");
            $(".fre").css("border", "black 4px solid");
        });
        $(".u_s").click(function() {
            $(".us").fadeIn(2000);
            $(".grandslams").hide();
            $(".wimbledon").hide();
            $(".australian").hide();
            $(".french").hide();
            $(".wim").css("border", "black 4px solid");
            $(".aus").css("border", "black 4px solid");
            $(".u_s").css("border", "#000080 8px solid");
            $(".fre").css("border", "black 4px solid");
        });
        $(".fre").click(function() {
            $(".french").fadeIn(2000);
            $(".grandslams").hide();
            $(".wimbledon").hide();
            $(".australian").hide();
            $(".us").hide();
            $(".wim").css("border", "black 4px solid");
            $(".aus").css("border", "black 4px solid");
            $(".u_s").css("border", "black 4px solid");
            $(".fre").css("border", "#000080 8px solid");
        });
    
    
    
    
    
    
//     $(".btn").click(function() {
//         $(".wimbledon").fadeIn(500);
//     });
    
//      $("#surface .dc-chart .selected circle, .dc-chart .selected path").click(function() {
//         $(".wimbledon").fadeIn(500);
//     });
    
//     $('.pie-slice').click(function() {
//      $(this).toggleClass('selected');
//      if ( $('.pie-slice').hasClass('selected') ) {
//         $(".wimbledon").fadeIn(500);
//     }});
    
//     d3.selectAll(".pie-slice").on("click", function() {
//   //check if node is already selected
//     var text = d3.select(this).select("text");
//     if (text.classed("selectedText")) {
//     text.classed("selectedText", false);
//      //Remove class selectedNode
//     } else {
//     text.classed("selectedText", true);    
//     //Adds class selectedNode
//   }
//   });
    
});