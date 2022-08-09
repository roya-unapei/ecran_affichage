//mettre en évidence l'heure actuelle
async function aff(h, min){
  var j = h - 1;
  var divHeure;
  var combi;
  var combi2;

    if(0 <= min && min < 15){
      combi2= j + ":45.0";
      combi = h + ":00.0";
    }else if (15 <= min && min <30){
      combi2= h + ":00.0";
      combi = h + ":15.0";
    }else if (30 <= min && min < 45){
      combi2= h + ":15.0";
      combi = h + ":30.0";
    }else if ( min >= 45){
      combi2= h + ":30.0";
      combi = h + ":45.0";
    }
   
    if (document.getElementsByClassName('col-sm-12') && document.getElementById(combi)){ //savoir si la div avec l'heure existe
      document.getElementById(combi2).style.backgroundColor = '#b2977248';
      divHeure = document.getElementById(combi);
      divHeure.style.backgroundColor = '#cab495';
    }

//colorer la réunion en cours faire : !!document.getElementId... pour savoir s'il existe ou pas return un booleen

}

async function displayUI() {    
    
  if ( sessionStorage.getItem('msalAccount')!= "ephemeride@unapei.org"){
     //console.log("***************" + sessionStorage.getItem('msalAccount'));
    await signIn();
  }
    const user = await getUser();
    var salles = [ "SalleCA@unapei.org",  "ComCour@unapei.org", "ComRue@unapei.org"]; // "rdc12personnes@unapei.org" "Rapidmooc@unapei.org"   
    var i =0;
    var salle = document.getElementById("time");
    creationHoraires(salle,i);
    i+=1;
    salles.forEach(elem => {
      displayEvents(elem, i); // permet d'afficher les calendriers
      ++i;
    });
}

async function creationHoraires(salle,x){
var combi;

  for (var h = 8; h<=18; ++h){ // heures
    
    var min = 0; // nouvelle heure donc min à 0
    
    for (var i = 1; i<=4; ++i){ // quart d'heure

      combi = h+":"+min;

      
      var divH = document.createElement('div');
      //divH.style.borderTop = "1px solid rgba(240, 229, 207, 0.63)";
      divH.style.fontSize = "25px";
      divH.style.height = "30px";

      if(h==8 || h== 9){
        combi = "0" + combi;
      }
      if (min==0){
        combi = combi + "0";
        divH.style.borderTop = "1px solid rgba(240, 229, 207, 0.63)";
        divH.style.fontWeight = "bold";
        divH.style.color = "black";
        //divH.style.textDecoration = "overline";
      }

      divH.setAttribute("id", combi+"."+x);

      if (x != 0 || min == 15 || min == 45){ // ne pas afficher les horaires dans les div des réunions ni ceux de 15 et 45
        divH.innerHTML = "&nbsp;";
      }else{
        divH.innerHTML = combi;
      }


      if (x == 0){ //délimiter matin et après-midi
        var col = document.createElement('div');
        col.className = 'col-sm-12';
        col.setAttribute('id', combi + '.' + x)
        if (combi == "12:45" || combi == "13:00" ||combi == "13:15" ||combi == "13:30" ||combi == "13:45"){
          col.style.backgroundColor = "white";
        }else{
          col.style.backgroundColor = "#b2977248";
        }
        

        col.appendChild(divH);
        var row = document.getElementById("timee");
        row.appendChild(col);
        salle.appendChild(row);
      }else{
        salle.appendChild(divH);
      }
      
      min +=15;
    } 
  }
}

async function displayEvents(elem, i) { 
  var events = await getEvents(elem);
  var salle;

  //classer en fonction de la salle
  if (elem.indexOf('Cour') != -1) { // si elem contient le string en paramètre
    salle = document.getElementById("Cour");
  }else if(elem.indexOf('CA') != -1) {
    salle = document.getElementById("CA");
  }else if(elem.indexOf('Rue') != -1) {
    salle = document.getElementById("Rue");
  }

  creationHoraires(salle,i);
  var z = 0;

  events.value.forEach(event => { // boucle pour afficher tous les évènements
    var heureD = new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
    var heureF = new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit' , minute: '2-digit'});
    var query = "<p style = 'font-size : 19px; color:black'; ><b>"+`${new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} à ${new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} `+"<span style='float: right'>" + ` Resp : ${event.organizer.emailAddress.name}` + "</span></p><p id = 'nomReunion"+ z + "." + i +"' style =  'color :black; text-align: center; font-size : 25px;'> " + `${event.subject}` + "</b></p>";
    
    //création des éléments pour afficher les réunions
    const myArrayD = heureD.split(":");// console.log(heureD) == 08:00
    const myArrayF = heureF.split(":");// console.log(heureF) == 08:00
    
    /*myArrayD[0] = heure
    myArrayD[1] = min*/


    if (myArrayD[0] > 18){ // reunion à partir de 19h...
      var divH = document.createElement('div');     
      divH.setAttribute("id", "heureSup");
      divH.style.fontSize = "25px";
      divH.innerHTML = query;
      divH.style.borderTop = "1px solid black";
      divH.style.borderBottom = "1px solid black";
      salle.appendChild(divH);
    }else {

      var div = document.getElementById(heureD+"."+i); 
    
      div.innerHTML = query;
      div.style.borderTop = "1px solid black";
      div.style.borderBottom = "1px solid black";
      div.style.overflow = "hidden";


      var resu = 0; //compter nombre de cases
      var min = Number(myArrayD[1]) + 15;
      var combi;

        for (var u = Number(myArrayD[0]); u <= myArrayF[0]; ++u){

                while ((min <= 45) && (combi != heureF)){

                  combi  = u + ":" + min;
                  if (u == 8 || u == 9){
                    combi = "0" + combi;
                  }
                  if(min==0){
                    combi = combi + "0";
                  }
                  resu+=1;
                  min +=15;
                  //console.log("test " + combi);

                  if(combi == heureF){
                    //console.log("ok pour " + heureF + " nb div : " + resu);
                    break;
                  }else {
                    var supp_div =document.getElementById(combi+"."+i);
                    supp_div.parentNode.removeChild(supp_div);
                  }
                }
                min = 0;
            }

            //redefinir la taille de la div qui contient la réunion
            var t = 30 * resu; //30 = taille définit lors de la création d'une div
            div.style.height = t+"px";
            var op = t /2 - 45;
            document.getElementById("nomReunion"+z +"."+i).style.marginTop= op+"px";
            document.getElementById("nomReunion"+z +"."+i).style.fontSize = "32px";
            ++z;
    }
    
  });

}