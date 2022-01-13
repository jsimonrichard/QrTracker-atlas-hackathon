import { Link } from "wouter";

export default function TrackerItem({ tracker }) {
    let datetime = new Date(tracker.status.timestamp);
    let now = new Date(Date.now())
    let diff = now.getTime() - datetime.getTime();
  
    let dateString = "";
    if(diff < (1000 * 3600 * 24) && now.getDay() === datetime.getDay()) {
      let hours = datetime.getHours();
      let noonSide = hours <= 12 ? "am" : "pm";
      hours = (hours-1)%12 + 1;
      let minutes = String(datetime.getMinutes()).padStart(2, "0");
  
      dateString = `${hours}:${minutes} ${noonSide}`;
    } else {
      let month = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ][datetime.getMonth()]
      let day = datetime.getDate();
  
      dateString = `${month} ${day}`;
    }
  
    return (
      <Link href={`/t/${tracker._id}`}>
        <div className="tracker-list-item">
          <h4>{tracker.title}</h4>
          <div>
            {dateString} - {tracker.status.message}
          </div>
        </div>
      </Link>
    )
  }