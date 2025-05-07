import "./Footer.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import fb from "../../assets/facebook.png"
import { Link } from "react-router-dom";
function Footer()
{
return (
<div className="footer">
    <div className="sb_footer section_padding">
        <div className="sb_footer-links">
            <div className="sb_footer-links-div">
            <img src="smart_learning\src\assets\mainlogo.png" alt="" />
            <Link to="" className="nav-link text-white">
             <h2>Skill Forge </h2>
          </Link>
            </div>
            <div className="sb_footer-links-div">
                <h4>About Us</h4>
                <p>
                Our platform is dedicated to empowering individuals by providing personalized skill assessments, tailored course recommendations, and curated job opportunities to help you advance your career.
                </p>
            </div>
            <div className="sb_footer-links-div">
                <h4>Contact</h4>
                <p>
                    <h5>Email:</h5>
                    <p>projectwork2324@gmail.com</p>
                    <h5>Phone:</h5>
                    <p>+91 87954 12421</p>
                </p>
            </div>
            <div className="sb_footer-links-div">
                <h4>Coming soon on...</h4>
                <div className="socialmedia">
                <p><img src={fb} alt="" /></p>
                <p><img src={fb} alt="" /></p>
                <p><img src={fb} alt="" /></p>
                <p><img src={fb} alt="" /></p>
                </div>
            </div>
            <hr></hr>
            <div className="sb_footer-below">
                <div className="sb_footer-copyright">
                    <p>
                        @{new Date().getFullYear()} Skill Forge All Rights reserved
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
);

}
export default Footer;
