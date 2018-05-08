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
    
});