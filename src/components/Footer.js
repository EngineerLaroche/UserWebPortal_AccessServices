import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div class="floatfooter">
  
        <br />
        <div class="footercolor"></div>
        <div class="underfootercolor">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          ></link>
          <div class="icon-bar">
            <a href="#" class="facebook">
              <i class="fa fa-facebook"></i>
            </a>
            &nbsp; &nbsp;
            <a href="#" class="twitter">
              <i class="fa fa-twitter"></i>
            </a>
            &nbsp; &nbsp;
            <a href="#" class="google">
              <i class="fa fa-google"></i>
            </a>
            &nbsp; &nbsp;
            <a href="#" class="linkedin">
              <i class="fa fa-linkedin"></i>
            </a>
            &nbsp; &nbsp;
            <a href="#" class="youtube">
              <i class="fa fa-youtube"></i>
            </a>
            &nbsp; &nbsp;
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
