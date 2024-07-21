import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class ExpensesService {

  private readonly logger = new Logger('ExpensesService');

  // Patron repositorio
  constructor(
    //Aquí injectamos el repositorio de la entidad Expense
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {

  }

  //Recordar que se deja como asincrona
  async create(createExpenseDto: CreateExpenseDto) {

    //Trycatch para manejo de errores
    try {
      //En una constante llamamos al repositorio con el metodo create y le pasamos el Dto
      const expense = this.expenseRepository.create(createExpenseDto);
      // Con esta linea de manera asincrona guardamos el registro en la base de datos
      await this.expenseRepository.save(expense);
      //Retornamos el resultado
      return expense;
    } catch (error) {
      //En caso de error llamamos al metodo de validacion de errores
      this.handleDBExceptions(error);
    }

  }

  //3..Se agrega paginationDto como parametro
  findAll(paginationDto: PaginationDto) {
    //4. Se desestructura el paginationDto
    const { limit = 10, offset = 0 } = paginationDto;
    //Esta linea lista todos los registros paginados, dentro del find colocamos take y skip y los valores del pagination
    return this.expenseRepository.find({
      take: limit,
      skip: offset,
    });
  }

  //Recordar que se deja como asincrona
  async findOne(id: string) {
    // Esta linea busca un solo registro por id
    const expense = await this.expenseRepository.findOneBy({ id });
    //Si el id no existe devuelve un mensaje de erro
    if (!expense) {
      throw new NotFoundException(`El gasto con el id ${id} no existe`);
    }
    //Si el id existe devuelve el registro
    return expense
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  //Recordar que se deja como asincrona
  async remove(id: string) {
    //Retornamos el metodo para buscar el id con sus validaciones
    const expense = await this.findOne(id)
    //Linea para eliminar el registro
    await this.expenseRepository.remove(expense);
    return { message: 'Eliminado exitosamente!', id }
  }

  // Metodo para manejar los errores de consulta
  private handleDBExceptions(error: any) {
    //Codigo de error para duplicados
    if (error.code === '23505') {
      //Devuelve el detalle del error
      throw new BadRequestException(error.detail)
    }
    /** Si ese no es el error llamamos al logger
     * Para que capture el tipo de error en caso de otro codigo
     */
    this.logger.error(error)
    // Tambien lo mostramos en consola
    console.log(error);
    // Linea de codigo especifica donde el desarrollador pueda revisar el mensaje
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
