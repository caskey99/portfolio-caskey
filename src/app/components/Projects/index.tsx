'use client';
import { motion } from 'framer-motion';
import styles from './Projects.module.scss';

const projects = [
  { id: 1, title: "E-Commerce Shop", category: "Web App", image: "" },
  { id: 2, title: "Crypto Dashboard", category: "Fintech", image: "" },
  { id: 3, title: "AI Chat Interface", category: "AI / LLM", image: "" },
  { id: 4, title: "3D Portfolio", category: "WebGL", image: "" },
  { id: 5, title: "Task Manager", category: "Productivity", image: "" },
  { id: 6, title: "Social Network", category: "Mobile", image: "" },
];

export default function Projects() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h3 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Selected Works
        </motion.h3>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.card}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.cardImage}>
                 {/* Заглушка картинки */}
                 <div className={styles.imgPlaceholder} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <h4>{project.title}</h4>
                    <span>{project.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}