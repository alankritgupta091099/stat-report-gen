import React from 'react';

const StaticWebsite = () => {
  return (
    <>
        <div class="page-hero-section bg-image hero-home-1" style={{backgroundImage: "url(../assets/img/bg_hero_1.svg)"}}>
            <div class="hero-caption pt-5">
                <div class="container h-100">
                <div class="row align-items-center h-100">
                    <div class="col-lg-6  fadeInUp">
                    <h1 class="mb-4">Generate your reports faster</h1>
                    <p class="mb-4">Get-measurements lets you to make report generation process<br/>
                    faster, easier and efficient</p>
                    <a href="/#" class="btn btn-primary rounded-pill">Try now</a>
                    </div>
                    <div class="col-lg-6 d-none d-lg-block  zoomIn">
                    <div class="img-place mobile-preview shadow floating-animate">
                        <img src="../assets/img/app_preview_1.png" alt=""/>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="position-realive bg-image" style={{backgroundImage: "url(../assets/img/pattern_1.svg)"}}>            
            <div class="page-section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-5 py-3">
                            <div class="img-place mobile-preview shadow zoomIn">
                                <img src="../assets/img/app_preview_2.png" alt="" />
                            </div>
                        </div>
                        <div class="col-lg-6 py-3 mt-lg-5">
                            <div class="iconic-list">
                            <div class="iconic-item fadeInUp">
                                <div class="iconic-md iconic-text bg-warning fg-white rounded-circle">
                                <span class="mai-cube"></span>
                                </div>
                                <div class="iconic-content">
                                <h5>Powerful Features</h5>
                                <p class="fs-small">Lets you make client reports in minutes</p>
                                </div>
                            </div>
                            <div class="iconic-item fadeInUp">
                                <div class="iconic-md iconic-text bg-info fg-white rounded-circle">
                                <span class="mai-shield"></span>
                                </div>
                                <div class="iconic-content">
                                <h5>Fully Secured</h5>
                                <p class="fs-small">Your data is secure with us</p>
                                </div>
                            </div>
                            <div class="iconic-item fadeInUp">
                                <div class="iconic-md iconic-text bg-indigo fg-white rounded-circle">
                                <span class="mai-desktop-outline"></span>
                                </div>
                                <div class="iconic-content">
                                <h5>Easy Monitoring</h5>
                                <p class="fs-small">You can easily monitor your client performance</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-section bg-dark fg-white">
            <div class="container">
                <h1 class="text-center">Why Choose Us</h1>

                <div class="row justify-content-center mt-5">
                <div class="col-md-6 col-lg-3 py-3">
                    <div class="card card-body border-0 bg-transparent text-center  zoomIn">
                    <div class="mb-3">
                        <img src="../assets/img/icons/rocket.svg" alt=""/>
                    </div>
                    <p class="fs-large">Very Fast</p>
                    <p class="fs-small fg-grey">Hours of work done in minutes</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 py-3">
                    <div class="card card-body border-0 bg-transparent text-center  zoomIn" data-wow-delay="600ms">
                    <div class="mb-3">
                        <img src="../assets/img/icons/coins.svg" alt=""/>
                    </div>
                    <p class="fs-large">Save Money</p>
                    <p class="fs-small fg-grey">Pocket friendly services</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 py-3">
                    <div class="card card-body border-0 bg-transparent text-center  zoomIn" data-wow-delay="800ms">
                    <div class="mb-3">
                        <img src="../assets/img/icons/support.svg" alt=""/>
                    </div>
                    <p class="fs-large">24/7 Support</p>
                    <p class="fs-small fg-grey">Easily accessible support</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 py-3">
                    <div class="card card-body border-0 bg-transparent text-center  zoomIn" data-wow-delay="1000ms">
                    <div class="mb-3">
                        <img src="../assets/img/icons/laptop.svg" alt=""/>
                    </div>
                    <p class="fs-large">Full Features</p>
                    <p class="fs-small fg-grey">Contain a lot of wonderful features as well</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            <div class="page-section">
            <div class="container">
                <div class="row">
                <div class="col-lg-7 py-3 mb-5 mb-lg-0">
                    <div class="img-place w-lg-75  zoomIn">
                    <img src="../assets/img/illustration_contact.svg" alt=""/>
                    </div>
                </div>
                <div class="col-lg-5 py-3">
                    <h1 class=" fadeInUp">Need a demo? <br/>
                    Contact us</h1>

                    <form class="mt-5">
                    <div class="form-group  fadeInUp">
                        <label for="name" class="fw-medium fg-grey">Fullname</label>
                        <input type="text" class="form-control" id="name"/>
                    </div>

                    <div class="form-group  fadeInUp">
                        <label for="email" class="fw-medium fg-grey">Email</label>
                        <input type="text" class="form-control" id="email"/>
                    </div>

                    <div class="form-group  fadeInUp">
                        <label for="message" class="fw-medium fg-grey">Message</label>
                        <textarea rows="6" class="form-control" id="message"></textarea>
                    </div>

                    <div class="form-group mt-4  fadeInUp">
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            </div>

            <div class="page-footer-section bg-dark fg-white">
            <div class="container">
                <div class="row mb-5 py-3">
                <div class="col-sm-6 col-lg-2 py-3">
                    <h5 class="mb-3">Pages</h5>
                    <ul class="menu-link">
                    <li><a href="/#" class="">Features</a></li>
                    <li><a href="/#" class="">Customers</a></li>
                    <li><a href="/#" class="">Pricing</a></li>
                    <li><a href="/#" class="">GDPR</a></li>
                    </ul>
                </div>
                <div class="col-sm-6 col-lg-2 py-3">
                    <h5 class="mb-3">Company</h5>
                    <ul class="menu-link">
                    <li><a href="/#" class="">About</a></li>
                    <li><a href="/#" class="">Team</a></li>
                    <li><a href="/#" class="">Leadership</a></li>
                    <li><a href="/#" class="">Careers</a></li>
                    <li><a href="/#" class="">HIRING!</a></li>
                    </ul>
                </div>
                <div class="col-md-6 col-lg-4 py-3">
                    <h5 class="mb-3">Contact</h5>
                    <ul class="menu-link">
                    <li><a href="/#" class="">Contact Us</a></li>
                    <li><a href="/#" class="">Office Location</a></li>
                    <li><a href="/#" class="">admin@get-measurements.media</a></li>
                    <li><a href="/#" class="">+91 9654682943</a></li>
                    </ul>
                </div>
                <div class="col-md-6 col-lg-4 py-3">
                    <h5 class="mb-3">Subscribe</h5>
                    <p>Get some offers, news, or update features of application</p>
                    <form>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Your email.."/>
                        <div class="input-group-append">
                        <button type="submit" class="btn btn-primary"><span class="mai-send"></span></button>
                        </div>
                    </div>
                    </form>
                    <div class="mt-4">
                    <a href="/#" class="btn btn-fab btn-primary fg-white"><span class="mai-logo-facebook"></span></a>
                    <a href="/#" class="btn btn-fab btn-primary fg-white"><span class="mai-logo-twitter"></span></a>
                    <a href="/#" class="btn btn-fab btn-primary fg-white"><span class="mai-logo-instagram"></span></a>
                    <a href="/#" class="btn btn-fab btn-primary fg-white"><span class="mai-logo-google"></span></a>
                    </div>
                </div>
                </div>
            </div>

            <hr/>

            <div class="container">
                <div class="row">
                <div class="col-12 col-md-6 py-2">
                    {/* <img src="../assets/favicon-light.png" alt="" width="40"/>                    */}
                    <p class="d-inline-block ml-2">Copyright &copy; <a class="fg-white fw-medium">Get Measurement</a>. All rights reserved</p>
                </div>
                <div class="col-12 col-md-6 py-2">
                    <ul class="nav justify-content-end">
                    <li class="nav-item"><a href="/#" class="nav-link">Terms of Use</a></li>
                    <li class="nav-item"><a href="/#" class="nav-link">Privacy Policy</a></li>
                    <li class="nav-item"><a href="/#" class="nav-link">Cookie Policy</a></li>
                    </ul>
                </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default StaticWebsite;