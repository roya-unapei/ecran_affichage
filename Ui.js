var tab=new Array();
var p = 0; //tableau horaires

/*si matin : h1=8 et hmax = 12 sinon après midi h1 = 13 et hmax = 18*/
var h1 =0; //savoir si c'est le matin ou l'aprem
var hmax =0; // fin des horaires en fonction de la page 

async function aff(h, min){
// colorer réunion en cours    
  for (var i=0; i<tab.length; i++) {
    if ((tab[i][0] < h) && (h < tab[i][2])){ 
        document.getElementById(tab[i][0] + ":" + tab[i][1] + "." + tab[i][4]).style.backgroundColor = '#84A9AC';//changer couleur réunion en cours
        document.getElementById(tab[i][0] + ":" + tab[i][1] + "." + tab[i][4]).style.color = 'white';//changer couleur réunion en cours
    }else if ((tab[i][0] == h &&  tab[i][1] <= min) || (tab[i][2] == h &&  tab[i][3] > min)){
      document.getElementById(tab[i][0] + ":" + tab[i][1] + "." + tab[i][4]).style.backgroundColor = '#84A9AC';//changer couleur réunion en cours
      document.getElementById(tab[i][0] + ":" + tab[i][1] + "." + tab[i][4]).style.color = 'white';//changer couleur réunion en cours
    }else{
      document.getElementById(tab[i][0] + ":" + tab[i][1] + "." + tab[i][4]).style.backgroundColor = '#b1b0ae6e'; //autres réunions b1b0ae6e  ece9e5b7
    }
  }
}

async function displayUI(h) {    

  h1 = h;
  if (h1==8){
    hmax = 12;
  }else{
    hmax = 18;
  }
    if ( sessionStorage.getItem('msalAccount')!= "ephemeride@unapei.org"){
      await signIn();
    }
      const user = await getUser();
      var salles = [ "SalleCA@unapei.org",  "ComCour@unapei.org", "ComRue@unapei.org"]; // "rdc12personnes@unapei.org" "Rapidmooc@unapei.org"   
      var i =0;
      var salle = document.getElementById("time");
      
      creationHoraires(salle,i, h1, hmax);
      i+=1;
      salles.forEach(elem => {
        displayEvents(elem, i); // permet d'afficher les réunions et accéder aux calendriers
        ++i;
      });
}
//Création plage horaire et des div => une div = une demie heure
async function creationHoraires(salle,x, h, hmax){
    var combi;
    
    for (var h; h<=hmax; ++h){ 
      
      var min = 0; //nouvelle heure donc min à 0
      
      for (var i = 1; i<=4; ++i){ // quart d'heure
  
        combi = h+":"+min;
  
        var divH = document.createElement('div');
        salle.appendChild(divH);
        divH.style.fontSize = "20px";
        divH.style.height = "30px";
  
        if(h==8 || h== 9){
          combi = "0" + combi;
        }
        if (min==0){
          combi = combi + "0";
          divH.style.borderTop = "1px solid #cfcfce8c";
          divH.style.fontWeight = "bold";
          divH.style.color = "black";
        }
  
        divH.setAttribute("id", combi+"."+x);
  // ne pas afficher les horaires dans les div des réunions ni ceux de 15 et 45
        if (x != 0 || min == 15 || min == 45){ 
          divH.innerHTML = "&nbsp;";
        }else{
          divH.innerHTML = combi;
          divH.style.textDecoration = "overline";
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
    
    creationHoraires(salle,i, h1, hmax);
    var z = 0;
    
    events.value.forEach(event => { // boucle pour afficher tous les évènements
        var heureD = new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 
        var heureF = new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit' , minute: '2-digit'});
        var query = "<strong><p id = 'dateEtHeure' style = 'float: left; margin-block-end: 0em; color : black; ' >"+`${new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} à ${new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} `+"</p><p id = 'responsable' style='float: right; margin-block-end: 0em; color : black;'>" + ` ${event.organizer.emailAddress.name}` +"</p><p id = 'nomReunion"+ z + "." + i +"' style =  ' text-align: center; font-size : 25px; clear : both ;'> " + `${event.subject}` + "</p></strong>";
    
        //création des éléments pour afficher les réunions
        const myArrayD = heureD.split(":");// console.log(heureD) == 08:00
        const myArrayF = heureF.split(":");// console.log(heureF) == 08:00
        
        /*myArrayD[0] = heure et myArrayD[1] = min*/
        
        // savoir quelle fonction appeler en fonction de la page html qui appelle le fichier js
        if(h1==8){
          page1(query, myArrayD, myArrayF, heureD, heureF, z, i);
        }else{
          page2(query, myArrayD, myArrayF, heureD, heureF, z, i);
        }
        ++z;
    });
}
// ajouter une réunion 
async function ajouterReu(query, myArrayD, myArrayF, heureD, heureF, z, i){
    tab[p]=new Array(myArrayD[0],myArrayD[1], myArrayF[0], myArrayF[1], i); // utiliser ce tableau pour savoir s'il y a un réunion en cours dans la fonction aff, i = num salle
    ++p;

    var div = document.getElementById(heureD+"."+i);

    div.style.borderRadius = "10px";
    div.style.boxShadow = "0px 2px 1px grey";
    div.style.borderColor = "#grey";
    div.style.overflow = "hidden";
    div.style.backgroundColor = "#b1b0ae6e";
    div.innerHTML = query;
    
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

            if(combi == heureF){
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
      console.log(op);
      document.getElementById("nomReunion"+z +"."+i).style.marginTop= op+"px"; // permet de centrer le texte
      
      if (resu == 2 || resu == 1){ //réunion de 30 min diminuer la police
        div.style.fontSize = "15px";
        document.getElementById("nomReunion"+z +"."+i).style.fontSize = "25px";
      }else if (op>= 80){ //si le margin top est sup à 80 (cad que la réunion dure plus de 2h) alors augmenter la taille du texte
        document.getElementById("nomReunion"+z +"."+i).style.fontSize = "38px";
      }else{
        document.getElementById("nomReunion"+z +"."+i).style.fontSize = "32px";
      }
}

//fonction pour la page du matin
async function page1(query, myArrayD, myArrayF, heureD, heureF, z, i) {
    if (myArrayD[0] <= 12){ //pour ne pas afficher les réunions à partir de 13h
      // si heure de fin est supérieur à 12 (13, 14...) alors heure de fin = 13, la suite sera afficher page 2 
        if(myArrayF[0] > 12){
          myArrayF[0] = 13;
          myArrayF[1] = 00;
          heureF = "13:00";
          //div.style.borderBottom = "none";
        }
        ajouterReu(query, myArrayD, myArrayF, heureD, heureF, z, i);
        
    }  
}

//fonction pour la page de l'après midi
async function page2(query, myArrayD, myArrayF, heureD, heureF, z, i) { 
    if (myArrayD[0] < 13 && myArrayF[0] <= 13){
        console.log(" ");
    }else {
      //si une réunion commence avant 13, l'heure de début sera 13h
        if(myArrayD[0] < 13 && myArrayF[0] > 13){ 
          myArrayD[0] = 13;
          myArrayD[1] = '00';
          heureD = "13:00";
        }
      // si reunion à partir de 19h => créer une nouvelle div
        if (myArrayD[0] > 18){ 
          var divH = document.createElement('div');     
          divH.setAttribute("id", "heureSup");
          divH.style.fontSize = "25px";
          divH.innerHTML = query;
          salle.appendChild(divH);

        }else {
          ajouterReu(query, myArrayD, myArrayF, heureD, heureF, z, i);
         
        }
    }
}