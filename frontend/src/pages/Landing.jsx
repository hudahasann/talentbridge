import { motion } from 'framer-motion';
import TrustBar from '../components/TrustBar';
import FeatureSection from '../components/FeatureSection';

function Landing({ setCurrentView }) {
  // Animation variants for scroll-reveal
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          className="hero-content" 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
        >
          <motion.span variants={fadeUp} className="hero-badge">Trusted by 500+ Hiring Teams</motion.span>
          <motion.h1 variants={fadeUp} className="hero-title">
            Hire top talent <span className="text-blue">faster</span> with TalentBridge.
          </motion.h1>
          <motion.p variants={fadeUp} className="hero-subtitle">
            The transparent recruitment platform that eliminates ghosting. 
            Track applicants through every stage and make data-driven hiring decisions.
          </motion.p>
          <motion.div variants={fadeUp} className="hero-actions">
            {/* CHANGED: Now navigates to login instead of register */}
            <button className="btn-primary-large" onClick={() => setCurrentView('login')}>
              Start Hiring for Free
            </button>
            <button className="btn-secondary-large" onClick={() => setCurrentView('jobs')}>
              Browse Jobs
            </button>
          </motion.div>
          <motion.p variants={fadeUp} className="hero-note">No credit card required. Free for small teams.</motion.p>
        </motion.div>
        
        {/* Visual Mockup */}
        <motion.div 
          className="hero-visual" 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="mockup-window">
            <div className="mockup-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="sidebar-logo"></div>
                <div className="sidebar-item active"></div>
                <div className="sidebar-item"></div>
                <div className="sidebar-item"></div>
              </div>
              
              <div className="mockup-content">
                <div className="mockup-header-bar">
                  <div className="mockup-title">Candidates (3)</div>
                  <div className="mockup-btn">+ Add Job</div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-avatar" style={{background: '#e0e7ff', color: '#4f46e5'}}>AK</div>
                  <div className="mockup-info">
                    <div className="mockup-name">Ali Khan</div>
                    <div className="mockup-role">MERN Developer</div>
                  </div>
                  <div className="mockup-status badge-interview">Interview</div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-avatar" style={{background: '#dcfce7', color: '#16a34a'}}>SA</div>
                  <div className="mockup-info">
                    <div className="mockup-name">Sara Ahmed</div>
                    <div className="mockup-role">Frontend Dev</div>
                  </div>
                  <div className="mockup-status badge-hired">Hired</div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-avatar" style={{background: '#fef3c7', color: '#d97706'}}>UT</div>
                  <div className="mockup-info">
                    <div className="mockup-name">Usman Tariq</div>
                    <div className="mockup-role">Backend Dev</div>
                  </div>
                  <div className="mockup-status badge-applied">Applied</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="floating-badge match-badge-float">
            <span className="match-dot"></span>
            98% Match Found
          </div>
          <div className="floating-badge applicant-badge-float">
            <div className="avatar-circle"></div>
            <div>
              <p className="applicant-name">New Applicant</p>
              <p className="applicant-role">MERN Developer</p>
            </div>
          </div>
        </motion.div>
      </section>

      <TrustBar />

      {/* FEATURES SECTION */}
      <section className="features-section">
        <motion.div 
          className="section-header" 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={fadeUp}
        >
          <h2>Everything you need to hire confidently.</h2>
          <p>Stop chasing candidates. Start building your dream team.</p>
        </motion.div>
        
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <FeatureSection icon="pipeline" title="Visual Pipeline Tracking" description="Move candidates from 'Applied' to 'Hired' with a simple drag-and-drop Kanban board." />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FeatureSection icon="match" title="Smart Candidate Matching" description="Instantly see a match score based on skills and experience. Focus on the best candidates." />
          </motion.div>
          <motion.div variants={fadeUp}>
            <FeatureSection icon="transparent" title="Transparent Communication" description="Candidates get real-time updates on their application status. Eliminate ghosting." />
          </motion.div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>Ready to transform your hiring?</h2>
        <p>Join hundreds of companies using TalentBridge to build better teams.</p>
        {/* This one still goes to register because it's the final call to action at the bottom of the page */}
        <button className="btn-primary-large" onClick={() => setCurrentView('register')}>
          Get Started for Free
        </button>
      </motion.section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TalentBridge</h3>
            <p>The modern recruitment platform for growing teams.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">For Employers</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 TalentBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;