import { useRef, useEffect } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'advertiser' | 'publisher' | 'viewer';
  color: string;
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  nodeIndex: number;
}

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let lastPulseTime = 0;
    let time = 0;

    const TYPE_COLORS = {
      advertiser: '#4F46E5',
      publisher: '#9333EA',
      viewer: '#06B6D4',
    };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const rect = canvas!.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = 400;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.scale(dpr, dpr);
    }

    function initNodes() {
      nodes = [];
      const count = 50;
      for (let i = 0; i < count; i++) {
        const types: Array<'advertiser' | 'publisher' | 'viewer'> = ['advertiser', 'publisher', 'viewer'];
        const weights = [0.2, 0.3, 0.5];
        let rand = Math.random();
        let type: 'advertiser' | 'publisher' | 'viewer' = 'viewer';
        let cumsum = 0;
        for (let j = 0; j < types.length; j++) {
          cumsum += weights[j];
          if (rand < cumsum) {
            type = types[j];
            break;
          }
        }

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: type === 'advertiser' ? 5 : type === 'publisher' ? 4 : 2.5,
          type,
          color: TYPE_COLORS[type],
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      time += 0.016;

      // Update nodes
      for (const node of nodes) {
        const distToMouse = Math.hypot(node.x - mouseRef.current.x, node.y - mouseRef.current.y);
        if (distToMouse < 100) {
          // Pause near mouse
          node.vx *= 0.95;
          node.vy *= 0.95;
        } else {
          node.x += node.vx;
          node.y += node.vy;
        }

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 150) {
            const opacity = 1 - dist / 150;
            const distToMouse = Math.hypot(
              (nodes[i].x + nodes[j].x) / 2 - mouseRef.current.x,
              (nodes[i].y + nodes[j].y) / 2 - mouseRef.current.y
            );
            const isHighlighted = distToMouse < 100;

            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(255, 255, 255, ${isHighlighted ? opacity * 0.4 : opacity * 0.12})`;
            ctx!.lineWidth = isHighlighted ? 1.5 : 0.5;
            ctx!.setLineDash([5, 15]);
            ctx!.lineDashOffset = -time * 20;
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
            ctx!.setLineDash([]);
          }
        }
      }

      // Spawn pulses
      if (time - lastPulseTime > 2) {
        lastPulseTime = time;
        const randomNode = Math.floor(Math.random() * nodes.length);
        pulses.push({
          x: nodes[randomNode].x,
          y: nodes[randomNode].y,
          radius: 0,
          alpha: 1,
          nodeIndex: randomNode,
        });
      }

      // Update and draw pulses
      pulses = pulses.filter(p => p.alpha > 0.01);
      for (const pulse of pulses) {
        pulse.radius += 1.5;
        pulse.alpha *= 0.98;

        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(79, 70, 229, ${pulse.alpha * 0.5})`;
        ctx!.lineWidth = 1;
        ctx!.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const distToMouse = Math.hypot(node.x - mouseRef.current.x, node.y - mouseRef.current.y);
        const isHovered = distToMouse < 100;

        // Glow
        ctx!.shadowBlur = isHovered ? 25 : 15;
        ctx!.shadowColor = node.color;

        // Main circle
        ctx!.beginPath();
        ctx!.fillStyle = node.color;
        ctx!.arc(node.x, node.y, isHovered ? node.radius * 1.3 : node.radius, 0, Math.PI * 2);
        ctx!.fill();

        // Inner highlight
        ctx!.shadowBlur = 0;
        ctx!.beginPath();
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx!.arc(
          node.x - node.radius * 0.2,
          node.y - node.radius * 0.2,
          node.radius * 0.4,
          0,
          Math.PI * 2
        );
        ctx!.fill();
      }

      ctx!.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    rafRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(draw);
          }
        } else {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '400px' }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-electric-blue shadow-glow-blue" />
          <span className="text-xs text-white/50">Advertisers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-vibrant-purple shadow-glow-purple" />
          <span className="text-xs text-white/50">Publishers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-glow-cyan" />
          <span className="text-xs text-white/50">Viewers</span>
        </div>
      </div>
    </div>
  );
}
