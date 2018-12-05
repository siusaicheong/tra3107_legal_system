/*
   Catdeveloper for TRA3107 (Version 1.0)
   (Wcatdeveloper.gear.host/main.js)
*/

function ngram(input,n){
  var output = [];
  input = input.split("");
  for(var i=0;i<input.length;i++){
    var temp = "";
    for(var j=0;j<n;j++){
      if((i+j)<input.length){
        temp += input[i+j];
      } else {
        temp = "";
        break;
      }
    }
    if(temp !== ""){
      Array.prototype.push.apply(output, [temp]);
    }
  }
  return output;
}

function sim(input1,input2){
  input1 = ngram(input1,2);
  input2 = ngram(input2,2);
  var score = 0.0;
  var score1 = 0.0;
  var score2 = 0.0;
  for(var i=0;i<input1.length;i++){
    if(input2.indexOf(input1[i]) !== -1){
      score1 = score1 + 1.0;
    }
  }
  for(var j=0;j<input2.length;j++){
    if(input1.indexOf(input2[j]) !== -1){
      score2 = score2 + 1.0;
    }
  }
  score = (score1 + score2) / (input1.length + input2.length) * 100.0;
  return score.toFixed(2);
}

function showArray(input,mode){
  var headings = input[0];
  var output = "";
  if(mode == 1){
    output += "<table class='dbr-table'><tr>";
    for(var h=0;h<headings.length;h++){
      output += "<th class='dbr-th dbr-col-"+h.toString()+"'>" + headings[h] + "</th>";
    }
    output += "</tr>";
    for(var i = 1;i<input.length;i++){
      var temp = "<tr>";
      var current = input[i];
      for(var j=0;j<current.length;j++){
        temp += "<td class='dbr-td dbr-col-"+j.toString()+"'>" + current[j] + "</td>";
      }
      temp += "</tr>";
      output += temp;
    }
    output += "</table>";
  } else {
    for(var k=1;k<input.length;k++){
      output += "<div class='dbr-div'><table class='dbr-table'>";
      var record = input[k];
      for(var l=0;l<record.length;l++){
        output += "<tr class='dbr-row-" + l.toString() + "'>";
        output += "<th class='dbr-th'>" + headings[l] + "</th>";
        output += "<td class='dbr-td'>" + record[l] + "</td>";
        output += "</tr>";
      }
      output += "</table></div>";
    }
  }
  return output;
}

function searchDB(input,db,matchMode,displayMode,highlightMode){
  if(input===""){
    return "Please provide the expression to be searched.";
  } else {
    try{
      var output = [];
      for(var i=1;i<db.length;i++){
        var current = db[i];
        var getRecord = false;
        for(var j=0;j<current.length;j++){
          var s1 = input.toLowerCase();
          var s2 = current[j].toLowerCase();
          if(s1 == s2){
              getRecord = true;
              break;
          } else {
            if(matchMode < 100){
              if(matchMode >= 50){
                if(sim(s1,s2) >= matchMode){
                  getRecord = true;
                  break;
                }
              } else {
                if((s1.indexOf(s2) !== -1) || (s2.indexOf(s1) !== -1)){
                  getRecord = true;
                  break;
                }
              }
            }
          }
        }
        if(getRecord){
          var temp = [];
          if(highlightMode == 1){
            for(var k=0;k<db[i].length;k++){
              Array.prototype.push.apply(temp, [db[i][k].split(input).join("<span class='dbr-span'>"+input+"</span>")]);
            }
            Array.prototype.push.apply(output, [temp]);
          } else {
            Array.prototype.push.apply(output, [db[i]]);
          }
        }
      }
      if(output.length > 0){
        output = [db[0]].concat(output);
        return showArray(output,displayMode);
      } else {
        return "Not found!";
      }
    }
    catch(err){
      console.log("Log: "+err);
      return "Not found!";
    }
  }
}

function convertText(input,db,source,target){
  if(input === ""){
    return "Please provide your text.";
  } else {
    try{
      var output = input.toLowerCase();
      source = db[0].indexOf(source); //case sensitive
      target = db[0].indexOf(target); //case sensitive
      if(source === undefined){
        source = 0;
      }
      if(target === undefined){
        target = 1;
      }
      var dbs = db.slice(1,db.length);
      dbs.sort(function(a,b){
        return (b[source].length - a[source].length);
      });
      for(var i=0; i<dbs.length;i++){
        if(output.indexOf(dbs[i][source].toLowerCase()) !== -1){
          var temp = output.split(dbs[i][source].toLowerCase());
          for(var j=0;j<temp.length;j++){
            temp[j] = temp[j].trim();
          }
          var space = "";
          var code = dbs[i][target].charCodeAt(0);
          if ((code <= 591) && (code >= 48)) {
            space = " ";
          }
          output = temp.join(space + dbs[i][target] + space);
        }
      }
      return output.trim();
    } 
    catch(err) {
      console.log("Log: "+err);
      return input;
    }
  }
}

function search(input,db){
  return searchDB(input, db, 100, 0, 0);
}

function searchDrawTable(input,db){
  return searchDB(input, db, 100, 1, 0);
}

function searchHighlight(input,db){
  return searchDB(input, db, 100, 0, 1);
}

function searchDrawTableHighlight(input,db){
  return searchDB(input, db, 100, 1, 1);
}

function fsearch(input,db){
  return searchDB(input, db, 25, 0, 0);
}

function fsearchDrawTable(input,db){
  return searchDB(input, db, 25, 1, 0);
}

function fsearchHighlight(input,db){
  return searchDB(input, db, 25, 0, 1);
}

function fsearchDrawTableHighlight(input,db){
  return searchDB(input, db, 25, 1, 1);
}

function convert(input,db,source,target){
  return convertText(input, db, source, target);
}