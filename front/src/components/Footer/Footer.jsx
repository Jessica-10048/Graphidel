import React from 'react'
import { Link } from 'react-router';
import { FaArrowRight } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { LiaShippingFastSolid } from "react-icons/lia";
const Footer = () => {
  return (

    // <!-- FOOTER -->
    <>
     <footer class="footer">
       <div class="footer-container"> 
        {/* <!-- Newsletter signup --> */}
         <div class="newsletter"> 
          <h3>Stay in the loop</h3> 
          <p>Get free templates, updates, and creative tips from Graphidel.</p> 
          <form action="newsletter.php" method="POST" class="newsletter-form"> 
            <input type="email" name="email" placeholder="Your email address" required/>
             <button type="submit">
             <FaArrowRight />
              </button>
               </form> 
               <small>By signing up, you agree to our 
                 <Link to="/privacy"> Privacy </Link> and <Link to="/terms"> Terms</Link>.</small> 
                </div>
                {/* <!-- Footer nav -->  */}
                <div class="footer-links"> 
                  <Link to="/about"><IoInformationCircleOutline/>About</Link> 
                  <Link to="/shop">< LiaShippingFastSolid /> Shipping</Link> 
                  <Link to="/terms"><TbContract/> Terms</Link>
                   <Link to="/privacy"><MdOutlinePrivacyTip/> Privacy</Link> 
                   <Link to="/contact"><MdMailOutline/> Contact</Link>
                   </div>
                    <p class="copyright">© 2025 Graphidel. All rights reserved.</p> 
                    </div>
                     </footer>
  </>
  )
}

export default Footer