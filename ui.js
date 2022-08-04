//mettre en évidence l'heure actuelle
async function aff(h, min){
  //console.log("heure " + h + ":" + min);
  var j = h - 1;
  var divHeure;

  var divH = document.createElement('div');

  if(0 <= min && min < 15){
    document.getElementById( j + ":45.0").style.backgroundColor = "transparent";
    divHeure = document.getElementById( h + ":00.0");
  }else if (15 <= min && min <30){
    document.getElementById( h + ":00.0").style.backgroundColor =  "transparent";
    divHeure = document.getElementById( h + ":15.0");
  }else if (30 <= min && min < 45){
    document.getElementById( h + ":15.0").style.backgroundColor =  "transparent";
    divHeure = document.getElementById( h + ":30.0");
    
      }else{
    // sup ou egale à 45
    document.getElementById( h + ":30.0").style.backgroundColor =  "transparent";
    divHeure = document.getElementById( h + ":45.0");

       // divH.innerHTML = "<hr>";
   /*divH.style.borderTop = "none";
   divH.style.borderTop = "2px solid black";
   divH.style.width= "700px";*/
  }

  divHeure.style.backgroundColor = 'rgb(214, 168, 168)';
  
  divHeure.appendChild(divH);

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
      divH.style.borderTop = "1px solid rgba(240, 229, 207, 0.63)";
      divH.style.fontSize = "15px";
      divH.style.height = "30px";

      if(h==8 || h== 9){
        combi = "0" + combi;
      }
      if (min==0){
        combi = combi + "0";
        divH.style.borderTop = "1px solid rgba(150, 22, 0, 0.966)";
      }

      divH.setAttribute("id", combi+"."+x);

      if (x != 0){ // ne pas afficher les horaires dans les div des réunions
        divH.innerHTML = "&nbsp;";
      }else{
        divH.innerHTML = combi;
      }
      
      salle.appendChild(divH);
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

  events.value.forEach(event => { // boucle pour afficher tous les évènements
    var heureD = new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
    var heureF = new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit' , minute: '2-digit'});
    var query = "<p style = 'font-size : 16px;' >"+`${new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} à ${new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} `+"<span style='float: right'>" + ` Resp : ${event.organizer.emailAddress.name}` + "</span><b></p><p id = 'nomReu' style =  'color :black; text-align: center; font-size : 25px;'> " + `${event.subject}` + "</b></p>";
    
    /*var query = `${event.subject}` ;*/
    
    //création des éléments pour afficher les réunions
    const myArrayD = heureD.split(":");// console.log(heureD) == 08:00
    const myArrayF = heureF.split(":");// console.log(heureF) == 08:00
    
    /*myArrayD[0] = heure
    myArrayD[1] = min*/

    var div = document.getElementById(heureD+"."+i); 
    
    div.innerHTML = query;
    div.style.borderTop = "3px solid black";
    div.style.borderBottom = "3px solid black";
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
    var t = 30 * resu; //30 = taille de base d'une div
    div.style.height = t+"px";

  });

}