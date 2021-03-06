
/////////////////////////////////////////////////////////////////////////////////////////////////////

var calendar_selected_input;

/////////////////////////////////////////////////////////////////////////////////////////////////////

function calendar_body_click(event)
{
  var calendar=document.getElementById("calendar_div");
  if (calendar)
  {
    if ((event.target==calendar) || (calendar.contains(event.target)==true))
    {
      return;
    }
    if (event.target.id)
    {
      if (calendar_inputs.includes(event.target.id)==true)
      {
        return;
      }
    }
    calendar.style.display="none";
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function show_calendar(event,element)
{
  var calendar=document.getElementById("calendar_div");
  if (!calendar)
  {
    document.getElementById("global_page_footer_content").innerHTML="calendar div not found";
    return;
  }
  calendar.style.display="none";
  calendar_selected_input=element;
  var existing_date=new Date();
  var date_in_input=document.getElementById("iso_"+calendar_selected_input.id).value;
  if (date_in_input)
  {
    var selected_date=false;
    var date_parts=date_in_input.split("-");
    if (date_parts.length==3)
    {
      date_parts[1]--; // for js date type, month starts from 0
      selected_date=new Date(date_parts[0],date_parts[1],date_parts[2]);
    }
    if ((selected_date) && (!isNaN(selected_date.getYear())))
    {
      existing_date=selected_date;
    }
  }
  make_calendar(date_in_input,existing_date.getYear(),existing_date.getMonth(),existing_date.getDate());
  calendar.style.display="block";
  var pos=webdb_get_position(calendar_selected_input);
  if ((pos.x+calendar.offsetWidth)>window.innerWidth)
  {
    calendar.style.left="initial";
    calendar.style.right=(window.innerWidth-pos.x-calendar_selected_input.offsetWidth)+"px";
  }
  else
  {
    calendar.style.right="initial";
    calendar.style.left=pos.x+"px";
  }
  if ((pos.y+calendar.offsetHeight)>window.innerHeight)
  {
    calendar.style.top="initial";
    calendar.style.bottom=(window.innerHeight-pos.y)+"px";
  }
  else
  {
    calendar.style.bottom="initial";
    calendar.style.top=(pos.y+calendar_selected_input.offsetHeight)+"px";
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function make_calendar(date_in_input,year,month,day)
{
  var calendar=document.getElementById("calendar_div");
  if (!calendar)
  {
    custom_alert("calendar div not found");
    return;
  }
  if (isNaN(day) && date_in_input)
  {
    var date_parts=date_in_input.split("-");
    if (date_parts.length==3)
    {
      date_parts[1]--;
      if ((year==date_parts[0]) && (month==date_parts[1]))
      {
        day=date_parts[2];
      }
    }
  }
  var today=new Date();
  year=parseInt(year);
  month=parseInt(month);
  day=parseInt(day);
  if (year<1900)
  {
    year+=1900;
  }
  var calendar_month_names=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var calendar_month_days=[31,28,31,30,31,30,31,31,30,31,30,31];
  if ((year%4)==0) // adjust for leap year
  {
    calendar_month_days[1]=29;
  }
  var calendar_weekdays=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var next_month=month+1;
  var next_month_year=year;
  if (next_month>=12)
  {
    next_month=0;
    next_month_year++;
  }
  var previous_month=month-1;
  var previous_month_year=year;
  if (previous_month<0)
  {
    previous_month=11;
    previous_month_year--;
  }
  var prev_month_link=document.getElementById("calendar_previous_month_link");
  if (previous_month_year>=1900)
  {
    prev_month_link.onclick=function(){ make_calendar(date_in_input,previous_month_year,previous_month); };
    prev_month_link.title=calendar_month_names[previous_month]+" "+previous_month_year;
  }
  else
  {
    prev_month_link.onclick=function(){ custom_alert("Unable to select year before 1900. Sorry."); };
    prev_month_link.title="Unable to select year before 1900. Sorry.";
  }
  var next_month_link=document.getElementById("calendar_next_month_link");
  if (next_month_year<=2200)
  {
    next_month_link.onclick=function(){ make_calendar(date_in_input,next_month_year,next_month); };
    next_month_link.title=calendar_month_names[next_month]+" "+next_month_year;
  }
  else
  {
    next_month_link.onclick=function(){ custom_alert("Unable to select year after 2200. Sorry."); };
    next_month_link.title="Unable to select year after 2200. Sorry.";
  }
  var calendar_month_select=document.getElementById("calendar_month_select");
  calendar_month_select.value=month;
  calendar_month_select.setAttribute("onchange","make_calendar('"+(date_in_input)+"',"+(year)+",this.value)");
  var calendar_year_select=document.getElementById("calendar_year_select");
  for (var i=calendar_year_select.options.length-1;i>=0;i--)
  {
    calendar_year_select.remove(i);
  }
  for (var i=1900;i<=2200;i++)
  {
    var year_option=document.createElement("option");
    year_option.value=i;
    year_option.text=i;
    calendar_year_select.add(year_option);
  }
  calendar_year_select.value=year;
  calendar_year_select.setAttribute("onchange","make_calendar('"+(date_in_input)+"',this.value,"+(month)+")");
  var first_day=new Date(year,month,1);
  var start_day=first_day.getDay();
  var d=1;
  var flag=0;
  var w=0;
  var days_in_this_month=calendar_month_days[month];
  var tbody="";
  for (var i=0;i<=5;i++)
  {
    tbody+="<tr>";
    for (var j=0;j<7;j++)
    {
      if (d>days_in_this_month)
      {
        flag=0; // if d has overshot the number of days in this month, stop writing
      }
      else if ((j>=start_day) && !flag)
      {
        flag=1; // if the first day of this month has come, start writing
      }
      if (flag)
      {
        var w=d;
        var mon=month+1;
        if (w<10)
        {
          w="0"+w;
        }
        if (mon<10)
        {
          mon="0"+mon;
        }
        var td_id="";
        var yea=today.getFullYear();
        if (yea<1900)
        {
          yea+=1900;
        }
        if ((yea==year) && (today.getMonth()==month) && (today.getDate()==d))
        {
          if ((day==d) && (date_in_input==(yea+"-"+mon+"-"+w)))
          {
            td_id=" id='calendar_selected_today'";
          }
          else
          {
            td_id=" id='calendar_today'";
          }
        }
        else if (day==d)
        {
          td_id=" id='calendar_selected'";
        }
        tbody+="<td"+td_id+" onclick='calendar_select_date(\""+year+"\",\""+mon+"\",\""+w+"\");' style='cursor: pointer;'>"+w+"</td>";
        d++;
      }
      else
      {
        tbody+="<td>&nbsp;</td>";
      }
    }
    tbody+="</tr>";
  }
  var tbody_element=calendar.getElementsByTagName("tbody")[0];
  tbody_element.innerHTML=tbody;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function hide_calendar()
{
  var calendar=document.getElementById("calendar_div");
  if (!calendar)
  {
    return;
  }
  calendar.style.display="none";
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function calendar_select_date(year,month,day)
{
  if (calendar_selected_input)
  {
    iso_date_element=document.getElementById("iso_"+calendar_selected_input.id);
    iso_date_element.value=year+"-"+month+"-"+day;
    calendar_selected_input.value=iso_to_formatted_date(iso_date_element.value);
    calendar_selected_input=undefined;
  }
  else
  {
    custom_alert("calendar_selected_input not set");
  }
  hide_calendar();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function calendar_clear_input(year,month,day)
{
  if (calendar_selected_input)
  {
    document.getElementById("iso_"+calendar_selected_input.id).value="";
    calendar_selected_input.value="";
    calendar_selected_input=undefined;
  }
  else
  {
    custom_alert("calendar_selected_input not set");
  }
  hide_calendar();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function get_iso_today_date()
{
  var today=new Date();
  var day=today.getDate();
  if (day<10)
  {
    day="0"+day;
  }
  var month=today.getMonth()+1;
  if (month<10)
  {
    month="0"+month;
  }
  var year=today.getFullYear();
  if (year<1900)
  {
    year+=1900;
  }
  return year+"-"+month+"-"+day;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function iso_to_formatted_date(iso_date)
{
  var date=new Date(iso_date);
  return format_date(date,document.getElementById("app_date_format").innerHTML);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function calendar_select_today()
{
  var iso_today=get_iso_today_date();
  if (calendar_selected_input)
  {
    iso_date_element=document.getElementById("iso_"+calendar_selected_input.id);
    iso_date_element.value=iso_today;
    calendar_selected_input.value=iso_to_formatted_date(iso_today);
    calendar_selected_input=undefined;
  }
  else
  {
    custom_alert("calendar_selected_input not set");
  }
  hide_calendar();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function format_date(date,format)
{
  // applies PHP date format to a javascript date object
  // outputs a string
  var H=date.getHours();
  if (H<10)
  {
    H="0"+H;
  }
  var i=date.getMinutes();
  if (i<10)
  {
    i="0"+i;
  }
  var s=date.getSeconds();
  if (s<10)
  {
    s="0"+s;
  }
  var j=date.getDate();
  var n=date.getMonth()+1;
  var Y=date.getFullYear();
  if (Y<1900)
  {
    Y+=1900;
  }
  var d=j;
  if (d<10)
  {
    d="0"+d;
  }
  var m=n;
  if (m<10)
  {
    m="0"+m;
  }
  var y=Y.toString().substring(2);
  var month_names=["January","February","March","April","May","June","July","August","September","October","November","December"];
  var F=month_names[n-1];
  var M=F.substring(0,3);
  format=format.replace("j",j.toString());
  format=format.replace("n",n.toString());
  format=format.replace("Y",Y.toString());
  format=format.replace("d",d);
  format=format.replace("m",m);
  format=format.replace("y",y);
  format=format.replace("F",F);
  format=format.replace("M",M);
  format=format.replace("H",H);
  format=format.replace("i",i);
  format=format.replace("s",s);
  return format;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

if (window.addEventListener)
{
  window.addEventListener("click",calendar_body_click);
}
else
{
  window.attachEvent("onclick",calendar_body_click);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
