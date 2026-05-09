import dashboardService from '../services/dashboard.service.js';

/**
 * Controller para Dashboard
 * Responsável APENAS por receber requisições HTTP e retornar respostas
 */

export const getDashboard = async (req, res) => {
  try {
    let dashboardData;

    if (req.user.tipo === 'proprietario') {
      dashboardData = await dashboardService.getDashboardProprietario();
    } else {
      dashboardData = await dashboardService.getDashboardLocatario(req.user.id);
    }

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
