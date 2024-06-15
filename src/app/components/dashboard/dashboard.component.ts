import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../client/dashboard.service';
import Chart from 'chart.js/auto';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [NgForOf],
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  totalConversasLeads: number = 0;
  totalConversasAlunos: number = 0;
  totalConversasMes: number = 0;
  conversasLeads: number = 0;
  conversasAlunos: number = 0;
  perguntasFrequentesArray: { pergunta: string; quantidade: number }[] = [];

  currentPage: number = 0;
  totalPages: number = 1;
  previousPage: number | null = null;
  nextPage: number | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    const pieChartCtx = document.getElementById(
      'myPieChart',
    ) as HTMLCanvasElement;
    const areaChartCtx = document.getElementById(
      'myAreaChart',
    ) as HTMLCanvasElement;

    if (pieChartCtx && areaChartCtx) {
      this.renderCharts();
    } else {
      console.error('Canvas elements not found');
    }
  }

  loadDashboardData(): void {
    this.dashboardService.getTotalConversasLeads().subscribe((data) => {
      this.totalConversasLeads = data;
    });

    this.dashboardService.getTotalConversasAlunos().subscribe((data) => {
      this.totalConversasAlunos = data;
    });

    this.dashboardService.getTotalConversasMes().subscribe((data) => {
      this.totalConversasMes = data.total;
      this.conversasLeads = data.leads;
      this.conversasAlunos = data.alunos;
      this.updatePieChart();
    });

    this.loadPerguntasFrequentes(this.currentPage);
  }

  updatePieChart(): void {
    const pieChart = Chart.getChart('myPieChart');
    if (pieChart) {
      const total = this.conversasLeads + this.conversasAlunos;
      const leadsPercentage = ((this.conversasLeads / total) * 100).toFixed(2);
      const alunosPercentage = ((this.conversasAlunos / total) * 100).toFixed(
        2,
      );
      pieChart.data.labels = [
        `Leads (${leadsPercentage}%)`,
        `Alunos (${alunosPercentage}%)`,
      ];
      pieChart.data.datasets[0].data = [
        this.conversasLeads,
        this.conversasAlunos,
      ];
      pieChart.update();
    } else {
      const pieChartCtx = document.getElementById(
        'myPieChart',
      ) as HTMLCanvasElement;
      if (pieChartCtx) {
        this.renderPieChart(pieChartCtx);
      }
    }
  }

  loadPerguntasFrequentes(page: number): void {
    this.dashboardService.getPerguntasFrequentes(page, 20).subscribe((data) => {
      this.perguntasFrequentesArray = data.content.reduce(
        (acc: { pergunta: string; quantidade: number }[], pergunta: string) => {
          const existingItem = acc.find((item) => item.pergunta === pergunta);
          if (existingItem) {
            existingItem.quantidade++;
          } else {
            acc.push({ pergunta, quantidade: 1 });
          }
          return acc;
        },
        [],
      );
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
      this.previousPage = data.first ? null : this.currentPage - 1;
      this.nextPage = data.last ? null : this.currentPage + 1;
    });
  }

  changePage(page: number | null): void {
    if (page !== null) {
      this.loadPerguntasFrequentes(page);
      window.scrollTo(0, 0);
    }
  }

  renderCharts(): void {
    const areaChartCtx = document.getElementById(
      'myAreaChart',
    ) as HTMLCanvasElement;
    const pieChartCtx = document.getElementById(
      'myPieChart',
    ) as HTMLCanvasElement;

    const areaChart = new Chart(areaChartCtx, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Earnings',
            data: [
              0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000,
              25000, 40000,
            ],
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointRadius: 3,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: 'rgba(255, 255, 255, 1)',
            pointHoverRadius: 3,
            pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
            pointHitRadius: 10,
            pointBorderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: 'rgba(234, 236, 244, 1)',
              drawOnChartArea: true,
              drawTicks: false,
            },
          },
        },
      },
    });

    this.renderPieChart(pieChartCtx);
  }

  renderPieChart(ctx: HTMLCanvasElement): void {
    const total = this.conversasLeads + this.conversasAlunos;
    const leadsPercentage = ((this.conversasLeads / total) * 100).toFixed(2);
    const alunosPercentage = ((this.conversasAlunos / total) * 100).toFixed(2);

    const pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          `Leads (${leadsPercentage}%)`,
          `Alunos (${alunosPercentage}%)`,
        ],
        datasets: [
          {
            data: [this.conversasLeads, this.conversasAlunos],
            backgroundColor: ['#4e73df', '#1cc88a'],
            hoverBackgroundColor: ['#2e59d9', '#17a673'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)',
          },
        ],
      },
      options: {
        cutout: '80%',
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const data = tooltipItem.chart.data.datasets[0].data;
                const value = data[tooltipItem.dataIndex];
                const label = tooltipItem.label;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  }
}
