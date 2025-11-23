'use client';
import { motion } from 'framer-motion';
import styles from './Projects.module.scss';

const projects = [
  { id: 1, title: "E-Commerce Shop", desc: "Next.js, Stripe, Tailwind" },
  { id: 2, title: "Crypto Dashboard", desc: "React, D3.js, WebSocket" },
  { id: 3, title: "AI Chat Interface", desc: "OpenAI API, TS, Node" },
  { id: 4, title: "3D Portfolio", desc: "Three.js, WebGL" },
];

export default function Projects() {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Selected Works</h3>
      <div className={styles.grid}>
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className={styles.card}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className={styles.cardImage} />
            <div className={styles.cardInfo}>
              <h4>{project.title}</h4>
              <p>{project.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}